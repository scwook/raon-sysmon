import time
import json
import psutil
import time
import threading
import datetime

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


totalSystemInfo = {
    'cpu' : {'percent' : 0},
    'memory' : {'total' : 0, 'used' : 0, 'percent' : 0},
    'disk' : {'total' : 0, 'used' : 0, 'percent' : 0},
    'network' : {'send' : 0, 'receive' : 0},
    }

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

@app.route('/datetime')
def get_datetime():
    current_datetime = {'datetime' : datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

    return json.dumps(current_datetime)


# @app.route('/network/raw')
# def get_network_traffic():

#     return json.dumps(network_total_byte)


def poll(interval):
    while True:

      tot_before = psutil.net_io_counters()
     # pnic_before = psutil.net_io_counters(pernic=True)

      # sleep some time
      time.sleep(interval)

      tot_after = psutil.net_io_counters()
     # pnic_after = psutil.net_io_counters(pernic=True)


      sendTraffic = tot_after.bytes_sent - tot_before.bytes_sent
      receiveTraffic = tot_after.bytes_recv - tot_before.bytes_recv

      totalSystemInfo['network']['send'] = sendTraffic
      totalSystemInfo['network']['receive'] = receiveTraffic


interval = 1
t = threading.Thread(target=poll, args=(interval,))
t.start()

@app.route('/sysinfo')
def get_system_infomation():

    # CPU
    cpuUsed = psutil.cpu_percent()
    totalSystemInfo['cpu']['percent'] = cpuUsed

    # Memory
    memory = psutil.virtual_memory()

    for name in memory._fields:
        value = getattr(memory, name)
        if name == 'total':
            totalSystemInfo['memory']['total'] = value
        elif name == 'used':
            totalSystemInfo['memory']['used'] = value
        elif name == 'percent':
            totalSystemInfo['memory']['percent'] = value

    # Disk
    disks = psutil.disk_usage('/')

    for name in disks._fields:
        value = getattr(disks, name)
        if name == 'total':
            totalSystemInfo['disk']['total'] = value
        elif name == 'used':
            totalSystemInfo['disk']['used'] = value
        elif name == 'percent':
            totalSystemInfo['disk']['percent'] = value


    return json.dumps(totalSystemInfo)

if __name__ == "__main__":
    app.run(host='192.168.0.99', port="9009")
