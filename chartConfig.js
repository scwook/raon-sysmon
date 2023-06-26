var cpuCurrentValue = 0.0;
var memoryCurrentValue = 0.0;
var diskCurrentValue = 0.0;
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

var cpuChartConfig = {
    // var color = Chart.helpers.color;
    type: 'line',
    data: {
        datasets: [{
            label: 'Primary',
            // backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
            borderColor: window.chartColors.blue,
            borderWidth: 3,
            pointRadius: 0,
            // fill: false,
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
                    refresh: 5000,
                    delay: 5000,
                    onRefresh: cpuDataRefresh
                },
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: false,
                    labelString: 'value'
                },
                gridLines: {
                    display: false
                },
                ticks: {
                    min: 0,
                    // max: 100,
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

var memoryChartConfig = {
    // var color = Chart.helpers.color;
    type: 'line',
    data: {
        datasets: [{
            label: 'Primary',
            // backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
            borderColor: window.chartColors.red,
            borderWidth: 3,
            pointRadius: 0,
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: [],
        }, {
            label: 'Secondary',
            // backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
            borderColor: window.chartColors.blue,
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
                    refresh: 5000,
                    delay: 5000,
                    onRefresh: memoryDataRefresh
                },
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: false,
                    labelString: 'value'
                },
                gridLines: {
                    display: false
                },
                ticks: {
                    min: 0,
                    max: 17,
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

var diskChartConfig = {
    // var color = Chart.helpers.color;
    type: 'line',
    data: {
        datasets: [{
            label: 'Primary',
            // backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
            borderColor: window.chartColors.green,
            borderWidth: 3,
            pointRadius: 0,
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: [],
        }, {
            label: 'Secondary',
            // backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
            borderColor: window.chartColors.blue,
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
                    onRefresh: diskDataRefresh
                },
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: false,
                    labelString: 'value'
                },
                gridLines: {
                    display: false
                },
                ticks: {
                    min: 0,
                    max: 33,
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


var networkChartConfig = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Primary',
            borderColor: window.chartColors.purple,
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: [],
        }, {
            label: 'Secondary',
            borderColor: window.chartColors.yellow,
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
                    duration: 60000,
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

function cpuDataRefresh(chart) {
    // var pValue = Math.floor(Math.random() * 10);
    var pValue = cpuCurrentValue;

    chart.config.data.datasets[0].data.push({
        x: Date.now(),
        y: pValue
    });
};

function memoryDataRefresh(chart) {
    // var pValue = Math.floor(Math.random() * 10);
    var pValue = memoryCurrentValue;

    chart.config.data.datasets[0].data.push({
        x: Date.now(),
        y: pValue
    });
};

function diskDataRefresh(chart) {
    // var pValue = Math.floor(Math.random() * 10);
    var pValue = diskCurrentValue;

    chart.config.data.datasets[0].data.push({
        x: Date.now(),
        y: pValue
    });
};

function networkDataRefresh(chart) {
    // var pValue = Math.floor(Math.random() * 10);
    let pValue = networkReceiveValue / MByte;
    let sValue = networkSendValue / MByte;
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