import os
from flask import Flask, render_template
from flask_pymongo import PyMongo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["DEBUG"] = True

# app.config["MONGO_URI"] = os.environ['MONGO_URI']
app.config["MONGO_URI"] = "mongodb://localhost:27017/redditsexism"

mongo = PyMongo(app)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run()
