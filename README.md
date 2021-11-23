# Exploring the effectiveness of real-time automated comment moderation using machine learning

## Project Description

Reviewing current research on automated sexism detection on social media, we came across an article and corresponding repository with a detailed training dataset and some sample models based on twitter data. Using a sample of the constructed dataset, we trained a convolutional neural network and deployed it to make predictions on live streamed reddit comments from specific subreddits.

We captured the live streamed comments and our model's predictions, storing them in a mongo atlas database. We then added a simple review page to our website that pulls a random comment from the database, displays the model's prediction and provides the user with the ability to contribute their own opinion on the comment.

On our dashboard we explored the original dataset, explained the basic structure of our model and its testing evaluation score, and presented a live look at the comments, predictions and votes collected by subreddit.

- Our findings are more thoroughly explained in [this google slide deck]().
- You can view our dashboard and vote on comments at https://capstone-app-hb.herokuapp.com.

### ETL

- Exploratory Analysis

- Database Design

- Data Transformations

### Modeling

- Data Preprocessing

- Feature Selection

- Model Selection

### Deployment and Dashboard Design

- Storyboarding

- Collecting Live Data using the Reddit API

- Allowing Votes

### Sources and Links

[“Call me sexist, but...” : Revisiting Sexism Detection Using Psychological Scales and Adversarial Samples](https://github.com/gesiscss/theory-driven-sexism-detection)

### Modules, Tools and Frameworks

- PRAW (a python wrapper for the reddit api)
- Tensorflow/Keras
- D3.js
- Flask
- Heroku Postgres
- Mongo Atlas
- Jupyter Notebook
- Pandas
