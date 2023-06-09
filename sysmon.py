import time
import json
import psutil
import time
import threading

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

network_total_byte = {'send' : 0, 'receive' : 0}

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

@app.route('/temperature')
def get_temperature():
    if not hasattr(psutil, "sensors_temperatures"):
        return "not supported"

    temperature = psutil.sensors_temperatures()

    print(temperature)
    return json.dumps(temperature)


@app.route('/network/traffic')
def get_network_traffic():

    return json.dumps(network_total_byte)


def poll(interval):
    while True:

      tot_before = psutil.net_io_counters()
     # pnic_before = psutil.net_io_counters(pernic=True)

      # sleep some time
      time.sleep(interval)

      tot_after = psutil.net_io_counters()
     # pnic_after = psutil.net_io_counters(pernic=True)
      

      network_total_byte['send'] = tot_after.bytes_sent - tot_before.bytes_sent
      network_total_byte['receive'] = tot_after.bytes_recv - tot_before.bytes_recv

interval = 1
t = threading.Thread(target=poll, args=(interval,))
t.start()


if __name__ == "__main__":
    app.run(host='localhost', port="9009")
