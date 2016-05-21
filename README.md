
# Monfort_Wiki

Monfort_wiki uses a Flask python server and an EmberJs front end.


## Notes:

  1. The Search Query is case sensitive and will only work for Wiki pages which have an InfoBox Template. For Example: "New York" will return a result, however "New york" will return an error
  2. Due to learning the frameworks, and time constraints, tests were not accurately testing the app and so they were removed.

## Preparing your Environment:  
  
  1. Install Python 2.7.9  
  2. Install Redis on port 8000
  3. Install Flask using `pip install Flask`
  4. Install EmberJS using `npm install -g ember-cli@2.5`
  1. If you do not have npm installed, you may install it using `brew install npm` or `linuxbrew install npm`
  5. Install PhantomJS for running tests `npm install -g phantomjs-prebuilt`


## Running the project:

  1. In the main folder run `python monfort_wiki.py` to start up the backend service on localhost:5000/

  2. Start the Celery Worker -  `celery -A monfort_wiki.celery worker`

  3. From the command line enter: `cd wiki-search` and then run `ember s` to start up the front end on localhost:4200/

## Required Python Libraries

  1. Python 2.7.9
  2. Flask
  3. Celery
  4. celery_once
  5. html5lib
  6. redis
  7. flask-redis
  8. flask-cors
