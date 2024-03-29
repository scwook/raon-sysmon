#!/usr/bin/nodejs
var http = require('http');
var fs = require('fs');

var app = http.createServer(function (request, response) {
    console.log(request.url);

    if (request.url == '/') {
        console.log('load html');
        response.writeHead(200);
        response.end(fs.readFileSync(__dirname + '/index.html'));
    }
    else if (request.url == '/index.css') {
        fs.readFile(__dirname + '/index.css', function (err, data) {
            response.writeHead(200);
            response.write(data);
            response.end();
        });
    }
    else if (request.url == '/config.js') {
        fs.readFile(__dirname + '/config.js', function (err, data) {
            response.writeHead(200);
            response.write(data);
            response.end();
        });
    }
    else if (request.url == '/influxDB.js') {
        fs.readFile(__dirname + '/influxDB.js', function (err, data) {
            console.log('influxDB.js loading...');
            response.writeHead(200);
            response.write(data);
            response.end();
        });
    }
    else if (request.url == '/liveGraph.js') {
        fs.readFile(__dirname + '/liveGraph.js', function (err, data) {
            response.writeHead(200);
            response.write(data);
            response.end();
        });
    }
    else if (request.url == '/script/moment.js') {
        fs.readFile(__dirname + '/script/moment.js', function (err, data) {
            response.writeHead(200);
            response.write(data);
            response.end();
        });
    }
    else if (request.url == '/script/chart.js@2.8.0') {
        fs.readFile(__dirname + '/script/chart.js@2.8.0', function (err, data) {
            response.writeHead(200);
            response.write(data);
            response.end();
        });
    }
    else if (request.url == '/script/chartjs-plugin-streaming.js') {
        fs.readFile(__dirname + '/script/chartjs-plugin-streaming.js', function (err, data) {
            response.writeHead(200);
            response.write(data);
            response.end();
        });
    }
    else if (request.url == '/images/favicon.png') {
        fs.readFile(__dirname + '/images/favicon.png', function (err, data) {
            response.writeHead(200);
            response.write(data);
            response.end();
        });
    }
    else if (request.url == '/images/raon-white.svg') {
        fs.readFile(__dirname + '/images/raon-white.svg', function (err, data) {
            response.writeHead(200);
            response.write(data);
            response.end();
        });
    }
    else if (request.url == '/images/background6.png') {
        fs.readFile(__dirname + '/images/background6.png', function (err, data) {
            response.writeHead(200);
            response.write(data);
            response.end();
        });
    }
    else if (request.url == '/fonts/Roboto-Light.ttf') {
        fs.readFile(__dirname + '/fonts/Roboto-Light.ttf', function (err, data) {
            response.writeHead(200);
            response.write(data);
            response.end();
        });
    }
    else if (request.url == '/fonts/Roboto-Thin.ttf') {
        fs.readFile(__dirname + '/fonts/Roboto-Thin.ttf', function (err, data) {
            response.writeHead(200);
            response.write(data);
            response.end();
        });
    }
    else if (request.url == '/timestamp') {
        date = new Date();
        response.writeHead(200);
        response.end(date.toString());
    }
});
app.listen(9009);
