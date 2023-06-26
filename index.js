var serverAddr = "http://192.168.60.123:8086";
var dataIOendpoint = "/api/v2/query?org=raon";
var queryString = serverAddr + dataIOendpoint;

var influxDBToken = "6dXJhSSVJ-uQWlZ9qhsza_jW52IS5qe7s_BIxQqAw99FuqWOeR5lPJ4mjnIfgMxLfLGVVq69uH6_KU1EHzKsWw=="; //RAON
// var influxDBToken = "6UyxcltMVociLrcCamGD1XzbfoQ5OSV4xjIU2waBfLM7fkfj6kRN0lNWIfgGl7PhXU5TfY33RvjgS0LaCWdfog=="; //HOME

var date = new Date();
var timezone = "+00:00";
var isoTime = date.toISOString().replace('Z', timezone);

const chartMaxLength = Math.ceil(186 * Math.PI); // L = 2 * PI * Radius
const KByte = 1000;
const MByte = KByte * 1000;
const GByte = MByte * 1000;
const TByte = GByte * 1000;
const PByte = TByte * 1000;

var systemQuery = 'from(bucket: "control") \
|> range(start: -10s) \
|> filter(fn: (r) => r["_measurement"] == "system") \
|> filter(fn: (r) => r["_field"] == "uptime" or r["_field"] == "n_cpus") \
|> last()';

var cpuQuery = 'from(bucket: "control") \
|> range(start: -1m) \
|> filter(fn: (r) => r["_measurement"] == "cpu") \
|> filter(fn: (r) => r["_field"] == "usage_system" or r["_field"] == "usage_user") \
|> filter(fn: (r) => r["cpu"] == "cpu-total") \
|> last()';

var memoryQuery = 'from(bucket: "control") \
|> range(start: -1m) \
|> filter(fn: (r) => r["_measurement"] == "mem") \
|> filter(fn: (r) => r["_field"] == "used" or r["_field"] == "used_percent" or r["_field"] == "total") \
|> last()';

var diskQuery = 'from(bucket: "control") \
|> range(start: -1m) \
|> filter(fn: (r) => r["_measurement"] == "disk") \
|> filter(fn: (r) => r["_field"] == "used_percent" or r["_field"] == "used" or r["_field"] == "total" ) \
|> last()';

var networkQuery = 'from(bucket: "control") \
|> range(start: -10s) \
|> filter(fn: (r) => r["_measurement"] == "net") \
|> filter(fn: (r) => r["_field"] == "bytes_recv" or r["_field"] == "bytes_sent") \
|> last()';

var queryData = {
    "system":
    {
        "dialect": {
            "annotations": [
                "group"
            ],
            "commentPrefix": "#",
            "dateTimeFormat": "RFC3339",
            "delimiter": ",",
            "header": true
        },
        "now": isoTime,
        "params": {},
        "query": systemQuery,
        "type": "flux"
    },
    "cpu":
    {
        "dialect": {
            "annotations": [
                "group"
            ],
            "commentPrefix": "#",
            "dateTimeFormat": "RFC3339",
            "delimiter": ",",
            "header": true
        },
        "now": isoTime,
        "params": {},
        "query": cpuQuery,
        "type": "flux"
    },
    "memory":
    {
        "dialect": {
            "annotations": [
                "group"
            ],
            "commentPrefix": "#",
            "dateTimeFormat": "RFC3339",
            "delimiter": ",",
            "header": true
        },
        "now": isoTime,
        "params": {},
        "query": memoryQuery,
        "type": "flux"
    },
    "disk":
    {
        "dialect": {
            "annotations": [
                "group"
            ],
            "commentPrefix": "#",
            "dateTimeFormat": "RFC3339",
            "delimiter": ",",
            "header": true
        },
        "now": isoTime,
        "params": {},
        "query": diskQuery,
        "type": "flux"
    },
    "network":
    {
        "dialect": {
            "annotations": [
                "group"
            ],
            "commentPrefix": "#",
            "dateTimeFormat": "RFC3339",
            "delimiter": ",",
            "header": true
        },
        "now": isoTime,
        "params": {},
        "query": networkQuery,
        "type": "flux"
    }
};

function doughnutChartAnimation(chartID, chartValue) {

    let maxValue = 100;
    // let randomValue = Math.random() * maxValue;
    let value = chartValue;
    let valueToOffset = Math.floor(chartMaxLength - chartMaxLength / maxValue * value);

    let fgID = document.getElementById(chartID);
    let currentDashOffset = parseInt(fgID.style.strokeDashoffset);

    let sign = valueToOffset - currentDashOffset;

    let dir = 0;
    if (sign > 0) {
        dir = -1; // anitclockwise, increase offset value
    } else if (sign < 0) {
        dir = 1; // clockwise, decrease offset value
    }

    if (dir == 0) {
        return;
    }

    let duration = 2000;
    let interval = 10;
    let count = 0;
    let maxCount = Math.floor(duration / interval);
    let x1 = 0.0;
    let x2 = 1.0;
    let dx = Math.abs(x1 - x2) / maxCount;
    let x = 0.0;
    let y = 0;
    let y1 = (dir == 1) ? valueToOffset : currentDashOffset;
    let y2 = (dir == 1) ? currentDashOffset : valueToOffset;
    let a = Math.abs(currentDashOffset - valueToOffset);
    let b = y1;

    let id = setInterval(function () {

        switch (dir) {
            case 1:
                y = a * Math.pow(2, -10 * x) + y1;
                break;

            case -1:
                y = a * (1 - Math.pow(2, -10 * x)) + y1;

                break;

            default:
                count = maxCount; // 
        }

        fgID.style.strokeDashoffset = Math.floor(y);

        x += dx;
        count += 1;

        if (count == maxCount) {
            clearInterval(id);
        }

    }, interval);
}

function changeUnit(byteValue) {
    let calValue = 0;
    let calUnit = 'B';

    if (byteValue / KByte < 1) {
        calValue = byteValue;
        calUnit = 'B';
    }
    else if (byteValue / MByte < 1) {
        calValue = byteValue / KByte;
        calUnit = 'KB';
    }
    else if (byteValue / GByte < 1) {
        calValue = byteValue / MByte;
        calUnit = 'MB';
    }
    else if (byteValue / TByte < 1) {
        calValue = byteValue / GByte;
        calUnit = 'GB';
    }
    else if (byteValue / PByte < 1) {
        calValue = byteValue / TByte;
        calUnit = 'TB';
    }
    else {
        calValue = byteValue / PByte;
        calUnit = 'PB';
    }

    return { value: calValue, unit: calUnit }
}

function monitoringSystem() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            let data = this.responseText.split(",");
            let uptimeIndex = data.indexOf("uptime") - 1;
            let nCPUsIndex = data.indexOf("n_cpus") - 1;

            let uptime = parseInt(data[uptimeIndex]);
            let ncpu = parseInt(data[nCPUsIndex]);

            document.getElementById('accelerator-control').innerText = Math.floor(uptime / 3600);
            document.getElementById('cpu-core').innerText = ncpu + 'Core';

        }
    };

    xhttp.open('POST', queryString, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader("Authorization", "Token " + influxDBToken)
    xhttp.send(JSON.stringify(queryData.system));

    let date = new Date();
    let isoTime = date.toISOString().replace('Z', timezone);
    queryData.cpu.now = isoTime;
}

function monitoringCPU() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            let data = this.responseText.split(",");
            let cpuUsageSystemIndex = data.indexOf("usage_system") - 1;
            let cpuUsageUserIndex = data.indexOf("usage_user") - 1;

            let cpuTotalPercent = parseFloat(data[cpuUsageSystemIndex]) + parseFloat(data[cpuUsageUserIndex]);
            document.getElementById('cpu-value').innerText = cpuTotalPercent.toFixed(1) + '%';
            cpuCurrentValue = cpuTotalPercent.toFixed(1);

            if (!documentHidden) {
                doughnutChartAnimation('cpu-chart', cpuTotalPercent);
            }
        }
    };

    xhttp.open('POST', queryString, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader("Authorization", "Token " + influxDBToken)
    xhttp.send(JSON.stringify(queryData.cpu));

    let date = new Date();
    let isoTime = date.toISOString().replace('Z', timezone);
    queryData.cpu.now = isoTime;
}

function monitoringMemory() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            let data = this.responseText.split(",");

            let memoryTotalIndex = data.indexOf("total") - 1;
            let memoryUsedIndex = data.indexOf("used") - 1;
            let memoryPercentIndex = data.indexOf("used_percent") - 1;

            let total = parseInt(data[memoryTotalIndex]);
            let used = parseInt(data[memoryUsedIndex]);
            let percent = parseFloat(data[memoryPercentIndex]);

            let unitDataTotal = changeUnit(total);
            let unitDataUsed = changeUnit(used);

            document.getElementById('memory-value').innerText = unitDataUsed.value.toFixed(1) + unitDataUsed.unit;
            document.getElementById('memory-total').innerText = unitDataTotal.value.toFixed(1) + unitDataTotal.unit;

            memoryCurrentValue = unitDataUsed.value.toFixed(1);

            if (!documentHidden) {
                doughnutChartAnimation('memory-chart', percent);
            }
        }

    };

    xhttp.open('POST', queryString, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader("Authorization", "Token " + influxDBToken)
    xhttp.send(JSON.stringify(queryData.memory));

    let date = new Date();
    let isoTime = date.toISOString().replace('Z', timezone);
    queryData.memory.now = isoTime;
}

function monitoringDisk() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            let data = this.responseText.split(",");


            let total = parseInt(data[32]);
            let used = parseInt(data[45]);
            let percent = parseFloat(data[84]);

            let unitDataTotal = changeUnit(total);
            let unitDataUsed = changeUnit(used);

            document.getElementById('disk-value').innerText = unitDataUsed.value.toFixed(1) + unitDataUsed.unit;
            document.getElementById('disk-total').innerText = unitDataTotal.value.toFixed(1) + unitDataTotal.unit;

            diskCurrentValue = unitDataUsed.value.toFixed(1);

            if (!documentHidden) {
                doughnutChartAnimation('disk-chart', percent);
            }
        }
    };

    xhttp.open('POST', queryString, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader("Authorization", "Token " + influxDBToken)
    xhttp.send(JSON.stringify(queryData.disk));

    let date = new Date();
    let isoTime = date.toISOString().replace('Z', timezone);
    queryData.disk.now = isoTime;
}

var beforeReceiveData = 0;
var beforeSendData = 0;

function monitoringNetwork() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            let data = this.responseText.split(",");
            
            let sendIndex = data.indexOf('bytes_sent');
            let receiveIndex = data.indexOf('bytes_recv');

            let send = parseInt(data[sendIndex-1]);
            let receive = parseInt(data[receiveIndex-1]);

            // console.log(data);
            // let unitReceiveData = changeUnit(receive);
            // let unitSendData = changeUnit(send);
            // console.log(data);

            // document.getElementById('network').innerText = unitReceiveData.value.toFixed(1) + unitReceiveData.unit + ',' + unitSendData.value.toFixed(1) + unitSendData.unit;

            let trafficReceive = receive - beforeReceiveData;
            let trafficSend = send - beforeSendData;

            let unitTrafficReceive = changeUnit(trafficReceive);
            let unitTrafficSend = changeUnit(trafficSend);

            document.getElementById('network-receive-value').innerText = unitTrafficReceive.value.toFixed(1) + unitTrafficReceive.unit + '/s';
            document.getElementById('network-send-value').innerText = unitTrafficSend.value.toFixed(1) + unitTrafficSend.unit + '/s';

            networkReceiveValue = trafficReceive;
            networkSendValue = trafficSend;

            beforeReceiveData = receive;
            beforeSendData = send;

            let date = new Date(data[sendIndex-2]);
            
            document.getElementById('timestamp-date').innerText = date.toLocaleDateString('en-CA');
            document.getElementById('timestamp-time').innerText = ' ' + date.toLocaleTimeString('en-GB');

        }
    };

    xhttp.open('POST', queryString, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader("Authorization", "Token " + influxDBToken)
    xhttp.send(JSON.stringify(queryData.network));

    let date = new Date();
    let isoTime = date.toISOString().replace('Z', timezone);
    queryData.network.now = isoTime;
}