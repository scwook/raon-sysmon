// InfluxDB Server Address
var SERVER_ADDR = "http://192.168.60.123:8086"

// InfluxDB Authorization Token
var INFLUXDB_TOKEN = "";

// InfluxDB Organization
var ORGANIZATION = "raon";

// InfluxDB Bucket
var BUCKET = "control";

// Server Location or Server Name(This text will be expressed on the webpage at right top)
var SERVER_NAME = "SR0104"

// Survice Name(This text will expressed right the SERVER_NAME text  )
var SERVICE_NAME = "ALARM";

function createGridItemHtml(count) {

    var gridItemHTML = '<div class="gridItem"> <div id="system-name'
        + count + '" class="gridItemTitle"></div> <div id="cpu-value'
        + count + '" class="doughnutChartText">0</div> \
<div class="networkValueContain"> \
    <svg width="24" height="24"> \
        <line x1="12" y1="0" x2="12" y2="13.6" style="fill:none;stroke:rgb(153, 102, 255);stroke-width:4;stroke-miterlimit:10;" /> \
        <polygon points="4.8,11.5 12,24 19.2,11.5 " style="fill:rgb(153, 102, 255);" /> \
    </svg> \
    <div id="network-send-value'
        + count + '" class="networkValue">0</div> \
    <div style="width:10px;"></div> \
    <svg width="24" height="24"> \
        <line x1="12" y1="24" x2="12" y2="10.3" style="fill:none;stroke:rgb(255, 205, 86);stroke-width:4;stroke-miterlimit:10;" /> \
        <polygon points="19.2,12.4 12,0 4.8,12.4 " style="fill:rgb(255, 205, 86);" /> \
    </svg> \
    <div id="network-receive-value'
        + count + '" class="networkValue">0</div> \
</div> \
<div class="doughnutContain"> \
    <svg width="200" height="200" style="fill:none"> \
        <circle class="doughnutBackground" cx="90" cy="90" r="52.5" /> \
        <circle class="cpuDoughnutChart" id="cpu-chart'
        + count + '" cx="90" cy="90" r="52.5" style="--doughuntColor:#00ace6;" /> \
    </svg> \
</div> \
<div class="doughnutContain"> \
    <svg width="200" height="200" style="fill:none"> \
        <circle class="doughnutBackground" cx="90" cy="90" r="71" /> \
        <circle class="memoryDoughnutChart" id="memory-chart'
        + count + '" cx="90" cy="90" r="71" style="--doughuntColor:#E4007F;" /> \
    </svg> \
</div> \
<div class="doughnutContain"> \
    <svg width="200" height="200" style="fill:none"> \
        <circle class="doughnutBackground" cx="90" cy="90" r="90" /> \
        <circle class="diskDoughnutChart" id="disk-chart'
        + count + '" cx="90" cy="90" r="90" style="--doughuntColor:#13AE67;" /> \
    </svg> \
</div> \
<div class="liveChartContain"> \
    <canvas id="network-graph'
        + count + '" style="width:600px; height:180px"></canvas> \
</div> \
</div>';

    return gridItemHTML;

}

