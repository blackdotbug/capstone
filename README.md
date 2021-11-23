# Exploring the effectiveness of real-time automated comment moderation using machine learning

----------------------

This branch is streamlined for Heroku deployment. Changes from main include:
- removal of reddit streaming endpoint from the flask app
- removal of all machine learning components
- addition of a Procfile
- addition of a runtime.txt to specify python version
- a streamlined requirements.txt
- switch sensitive info from gitignored config files to heroku environment variables
