import os
from flask import Flask, render_template, jsonify, request, redirect, url_for
from flask_pymongo import PyMongo
from flask_cors import CORS
from tensorflow import keras
import psycopg2
from sqlalchemy import create_engine
import numpy as np
import pandas as pd
from helpers import preprocess, get_model
import praw
from time import sleep
from bs4 import BeautifulSoup
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)

app.config["DEBUG"] = True

app.config["MONGO_URI"] = os.environ['mongoURI']

DATABASE_URL = os.environ['postgresURI']
engine = create_engine(DATABASE_URL)

reddit = praw.Reddit(
    client_id=os.environ['clientID'],
    client_secret=os.environ['clientSecret'],
    user_agent="predicting sexism"
)

mongo = PyMongo(app)
redditcomments = mongo.db.comments

model = get_model()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/review")
def review_comments():
    random_comment = list(redditcomments.aggregate([{ "$sample": { 'size': 1 } }]))
    return render_template("review.html", comment=random_comment[0])

@app.route("/score/<id>/<sexist>")
def score_comment(id,sexist):
    redditcomments.update_one({'_id':ObjectId(id)}, {'$push': {'votes': sexist}})
    return redirect(url_for('review_comments'))

@app.route("/stream/<subreddit>")
def stream(subreddit):
    for comment in reddit.subreddit(subreddit).stream.comments():
        comment_body = BeautifulSoup(comment.body_html, 'html.parser')
        if comment_body:
            quote = comment_body.blockquote
            if quote:
                comment_body = comment_body.blockquote.decompose()
            if comment_body:
                prediction = model.predict([preprocess(comment_body.get_text())])
                existing = redditcomments.find_one({"url":comment.permalink})
                sexist = False
                if prediction[0][0].item() > 0.5:
                    sexist = True
                if not existing:
                    redditcomments.insert_one({'comment': comment.body_html, 'processed_comment':preprocess(comment_body.get_text()), 'prediction':prediction[0][0].item(), 'url':comment.permalink, 'subreddit': subreddit, 'votes': [sexist]})
        sleep(1)

@app.route("/api/sexism")
def load_sexism_data():
    sexism_df = pd.read_sql('SELECT * FROM sexism_data', engine)
    result = []
    for index, row in sexism_df.iterrows():
        datapoint = dict(row)
        datapoint['text_preprocessed'] = preprocess(row['text'])
        result.append(datapoint)
    return jsonify(result)

@app.route("/api/redditcomments")
def load_comments():
    return jsonify(list(redditcomments.find({ }, { '_id': 0})))

# @app.route("/garbage")
# def garbage():
#     trash_comments = list(redditcomments.aggregate([{"$match": {'subreddit':"AskReddit"}},{ "$sample": { 'size': 4000 }}]))
#     for comment in trash_comments:
#         redditcomments.delete_one({'_id': ObjectId(comment['_id'])})
#     return "garbage collected"


if __name__ == "__main__":
    app.run()
