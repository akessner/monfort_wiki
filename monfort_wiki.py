from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello Avi!'

@app.route('/api/v1.0/wiki', methods=['GET'])
def get_tasks():
    wiki_data = {'city': 'New York', 'state': 'New York', 'country': 'United States of America'}
    return jsonify({'result': wiki_data, 'status': 'ok'})

app.debug = True

if __name__ == '__main__':
    app.run()
