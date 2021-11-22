import os
from flask import Flask, render_template, jsonify, request, redirect, url_for
from flask_pymongo import PyMongo
from flask_cors import CORS
import psycopg2
from sqlalchemy import create_engine
import pandas as pd
from helpers import preprocess
from bs4 import BeautifulSoup
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)

# app.config["DEBUG"] = True

app.config["MONGO_URI"] = os.environ['mongoURI']

DATABASE_URL = os.environ['postgresURI']
engine = create_engine(DATABASE_URL)

mongo = PyMongo(app)
redditcomments = mongo.db.comments

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

if __name__ == "__main__":
    app.run()
