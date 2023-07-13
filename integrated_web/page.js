var cpuIntervalId;
var memroyIntervalId;
var diskIntervalId;
var networkIntervalId;
var documentHidden = false;

var networkValueArray = [];
var influxDBQueryArray = [];

var cpuValueDefaultName = 'cpu-value';
var cpuChartDefaultName = 'cpu-chart';
var memoryChartDefaultName = 'memory-chart';
var diskChartDefaultName = 'disk-chart';
var networkDefaultSendName = 'network-send-value';
var networkDefaultReceiveName = 'network-receive-value';
var networkDefaultGraphName = 'network-graph';

const smallChartDashOffset = '330';
const mediumChartDashOffset = '446';
const largeChartDashOffset = '565';

function createGridItemHtml(count, title) {

    var gridItemHTML = '<div class="gridItem"> <div id="system-name'
        + count + '" class="gridItemTitle">' + title + '</div><div id="cpu-value'
        + count + '" class="doughnutChartText">0</div> \
<div class="networkValueContain"> \
    <svg width="24" height="24"> \
    <line x1="12" y1="24" x2="12" y2="10.3" style="fill:none;stroke:rgb(153, 102, 255);stroke-width:4;stroke-miterlimit:10;" /> \
    <polygon points="19.2,12.4 12,0 4.8,12.4 " style="fill:rgb(153, 102, 255);" /> \
    </svg> \
    <div id="network-send-value'
        + count + '" class="networkValue">0</div> \
    <div style="width:10px;"></div> \
    <svg width="24" height="24"> \
    <line x1="12" y1="0" x2="12" y2="13.6" style="fill:none;stroke:rgb(255, 205, 86);stroke-width:4;stroke-miterlimit:10;" /> \
    <polygon points="4.8,11.5 12,24 19.2,11.5 " style="fill:rgb(255, 205, 86);" /> \
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
        + count + '" style="width:600px; height:220px"></canvas> \
</div> \
</div>';

    return gridItemHTML;

}

function addMonitoring(title, buckName) {
    let gridItemArray = document.getElementsByClassName('gridItem');
    // let gridContainerArray = document.getElementsByClassName('gridContainer');

    let count = gridItemArray.length;
    let number = count + 1;
    let containIdx = parseInt(count / 6);

    document.getElementsByClassName('gridContainer')[containIdx].innerHTML += createGridItemHtml(number, title);

    let cpuValueId = cpuValueDefaultName + number;
    let cpuChartId = cpuChartDefaultName + number;
    let memoryChartId = memoryChartDefaultName + number;
    let diskChartId = diskChartDefaultName + number;
    let networkSendId = networkDefaultSendName + number;
    let networkReceiveId = networkDefaultReceiveName + number;
    let networkGraphId = networkDefaultGraphName + number;

    document.getElementById(cpuChartId).style.strokeDashoffset = smallChartDashOffset;
    document.getElementById(memoryChartId).style.strokeDashoffset = mediumChartDashOffset;
    document.getElementById(diskChartId).style.strokeDashoffset = largeChartDashOffset;

    networkValueArray[count] = { 'send': 0, 'receive': 0 };
    influxDBQueryArray[count] = createInfluxDBQuery(buckName);

    monitoringCPU(cpuValueId, cpuChartId, count);
    monitoringMemory(memoryChartId, count);
    monitoringDisk(diskChartId, count);
    monitoringNetwork(networkSendId, networkReceiveId, count);

    cpuIntervalId = setInterval(monitoringCPU, 5000, cpuValueId, cpuChartId, count);
    memroyIntervalId = setInterval(monitoringMemory, 10000, memoryChartId, count);
    diskIntervalId = setInterval(monitoringDisk, 60000, diskChartId, count);
    networkIntervalId = setInterval(monitoringNetwork, 5000, networkSendId, networkReceiveId, count);

    setTimeout(function () {
        new Chart(document.getElementById(networkGraphId).getContext('2d'), createChartConfig());

    }, 1000);

}

var slideIndex = 1;
function changePage(count) {

    slideIndex += count;
    n = slideIndex;

    var i;
    var x = document.getElementsByClassName("slide-page");

    if (n > x.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = x.length
    }

    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }

    if (count < 0) {
        x[slideIndex - 1].style.position = "relative";
        x[slideIndex - 1].style.animation = "animateleft 0.4s";
        x[slideIndex - 1].style.display = "block";
    }
    else {
        x[slideIndex - 1].style.position = "relative";
        x[slideIndex - 1].style.animation = "animateright 0.4s";
        x[slideIndex - 1].style.display = "block";
    }

}