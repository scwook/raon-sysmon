import time
import json
import psutil
import time

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/cpu/raw')
def get_cpu():
    cpu_percent_percpu = psutil.cpu_percent(interval=1, percpu=True)
    cpu_percent = psutil.cpu_percent(interval=1)

    print(cpu_percent_percpu)
    return json.dumps(cpu_percent_percpu)

@app.route('/disk/raw')
def get_disk():
    disks = psutil.disk_usage('/')

    print(disks)
    return json.dumps(disks)

@app.route('/memory/raw')
def get_memory():
    memory = psutil.virtual_memory()

    print(memory)
    return json.dumps(memory)

@app.route('/network/raw')
def get_network():
    network_io_counters = psutil.net_io_counters(pernic=True)
    
    print(network_io_counters)
    return json.dumps(network_io_counters)

if __name__ == "__main__":
    app.run(host='localhost', port="9009")
