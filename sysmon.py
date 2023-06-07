import time
import json
import psutil
import time

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/getcpu/raw')
def get_cpu():
    cpu_percent_percpu = psutil.cpu_percent(interval=1, percpu=True)
    cpu_percent = psutil.cpu_percent(interval=1)

    return json.dumps(cpu_percent_percpu)

@app.route('/getdisk/raw')
def get_disk():
    disks = psutil.disk_usage('/')
    return json.dumps(disks)

@app.route('/getmemory/raw')
def get_memory():
    memory = psutil.virtual_memory()

    return json.dumps(memory)

@app.route('/getnetwork/raw')
def get_network():
    network_io_counters = psutil.net_io_counters(pernic=True)
    return json.dumps(network_io_counters)

if __name__ == "__main__":
    app.run(host='192.168.0.99', port="9009")
