import re
import json
from flask import Flask, jsonify, request, Response

from libs.wptools_master.wptools.fetch import get_parsetree, WPToolsFetch
from libs.wptools_master.wptools.extract import infobox
from celery import Celery
import libs.wptools_master.wptools as wptools
from celery_once import QueueOnce
from flask.ext.cors import CORS, cross_origin
from flask.ext.redis import FlaskRedis
import time


app = Flask(__name__)
app.config.update(
    CELERY_BROKER_URL='redis://127.0.0.1:8000/1',
    CELERY_RESULT_BACKEND='redis://127.0.0.1:8000/1',
    REDIS_URL='redis://127.0.0.1:8000/2',
    BROKER_URL='redis://127.0.0.1:8000/1',
    ONCE_REDIS_URL = 'redis://127.0.0.1:8000/1',
    ONCE_DEFAULT_TIMEOUT = 60 * 60,
)
CORS(app)
redis_store = FlaskRedis(app)

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

job_number = 0


@celery.task(base=QueueOnce, once={'graceful': True})
def search_wiki(query):
    try:
        data = get_parsetree(query, False, False, WPToolsFetch.ENDPOINT, True)
        result = strip_wiki_links(str(infobox(data)))
    except:
        result = jsonify({"Error": "Could not parse Wiki Page"})
    return result

def strip_wiki_links(blob):
    wikilink_rx = re.compile(r'\[\[(?:[^|\]]*\|)?([^\]]+)\]\]')
    return wikilink_rx.sub(r'\1', blob)

@app.route('/')
@cross_origin()
def do_celery_search():
    job = search_wiki.delay(request.values["query"])
    redis_store.hmset(int(time.time()*1000), {"query": request.values["query"],"status": "IDLE", "job_id": str(job)})
    return "Job number is = %s " % str(job)


@app.route('/api/v1.0/wiki')
@cross_origin()
def get_tasks():
    tasks = []
    redis_keys = redis_store.keys("*")
    if len(redis_keys) > 0:
        redis_keys.sort()
        for redis_key in redis_keys:
            data = taskstatus(redis_store.hget(redis_key, "job_id"), redis_key)
            task_json = data.data.replace('\n', ' ').replace('\r', '').replace('<br />', ' ')
            tasks.append(task_json)
    return Response(json.dumps(tasks),  mimetype='application/json')


def taskstatus(task_id, redis_key):
    task = search_wiki.AsyncResult(task_id)
    response = {'query': redis_store.hget(redis_key, "query"), 'result': '{"ERROR": "Could Not Parse" }', 'status': "ERROR"}
    if task.state == 'PENDING':
        response = {'query': redis_store.hget(redis_key, "query"), 'result': '{"IDLE" : "..."}', 'status': 'IDLE'}
    elif task.state != 'FAILURE':
        response = {'query': redis_store.hget(redis_key, "query"), 'status': "RUNNING", 'result': '{"RUNNING" : "..."}'}
        if len(task.info) > 10:
            response['result'] = task.info
            response['status'] = "COMPLETED"
    else:
        # something went wrong in the background job
        response = {'query': redis_store.hget(redis_key, "query"), 'result': '{"ERROR": "%s" }' % (str(task.info)),'status': "ERROR"}
    return jsonify(response)

app.debug = True

if __name__ == '__main__':
    app.run()