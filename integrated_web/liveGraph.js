var networkReceiveValue = 0.0;
var networkSendValue = 0.0;

var chartColors = {
    red: '#E4007F',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: '#13AE67',
    blue: '#00ace6',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

var networkChartConfig = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Primary',
            borderColor: window.chartColors.purple,
            borderWidth: 3,
            pointRadius: 0,
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: [],
        }, {
            label: 'Secondary',
            borderColor: window.chartColors.yellow,
            borderWidth: 3,
            pointRadius: 0,
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: [],
        }]
    },
    options: {
        title: {
            display: true,
            text: ''
        },
        legend: {
            display: false
        },
        layout: {
            padding: {
                bottom: 10
            }
        },
        responsive: false,
        scales: {
            xAxes: [{
                type: 'realtime',
                realtime: {
                    duration: 300000,
                    refresh: 1000,
                    delay: 2000,
                    onRefresh: networkDataRefresh,
                },
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'MB/s'
                },
                gridLines: {
                    display: false
                },
                ticks: {
                    min: 0,
                    // max: 1000000,
                    // stepSize: 200000
                }
            }]
        },
        tooltips: {
            mode: 'nearest',
            intersect: false
        },
        hover: {
            mode: 'nearest',
            intersect: false
        }
    }
};

function networkDataRefresh(chart) {
    let pValue = networkSendValue / MByte;
    let sValue = networkReceiveValue / MByte;
    var timestamp = Date.now();

    chart.config.data.datasets[0].data.push({
        x: timestamp,
        y: pValue
    });

    chart.config.data.datasets[1].data.push({
        x: timestamp,
        y: sValue
    });
};