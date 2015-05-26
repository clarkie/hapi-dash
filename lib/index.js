var blessed = require('blessed');
var contrib = require('blessed-contrib');
var _ = require('lodash');

exports.register = function (server, options, next) {

    var screen = blessed.screen();

    var grid = new contrib.grid({rows: 12, cols: 12, screen: screen})

    screen.render();

    var renderBar = function (s, b, data) {

        var titles = [];
        var values = [];

        _.forEach(data, function (count, method) {
            titles.push(method);
            values.push(count);
        });

        var barData = { titles: titles, data: values };

        b.setData(barData);
        s.render();
    };

    var httpMethodBar = grid.set(0, 0, 6, 6, contrib.bar, {
        label: 'HTTP Methods',
        barWidth: 4,
        barSpacing: 6,
        xOffset: 0,
        maxHeight: 9
    });
    var statusCodeBar = grid.set(0, 6, 6, 6, contrib.bar, {
        label: 'Status Code',
        barWidth: 4,
        barSpacing: 6,
        xOffset: 0,
        maxHeight: 9
    });

    var reqPerSec = grid.set(6, 0, 6, 12, contrib.line, {
        style: {
            line: "yellow",
            text: "green",
            baseline: "black"
        },
        xLabelPadding: 3,
        xPadding: 5,
        showLegend: true,
        wholeNumbersOnly: false, //true=do not show fraction in y axis
        label: 'Title'
    });

    var series1 = {
        title: 'apples',
        x: ['t1', 't2', 't3', 't4'],
        y: [10, 3, 2, 6]
    }
    var series2 = {
        title: 'oranges',
        style: {
            line: 'red'
        },
        x: ['t1', 't2', 't3', 't4'],
        y: [5, 1, 7, 5]
    }

    screen.append(reqPerSec) //must append before setting data
    reqPerSec.setData([series1, series2])

    var httpMethodData = {};
    var statusCodeData = {};

    renderBar(screen, httpMethodBar, httpMethodData);
    renderBar(screen, statusCodeBar, statusCodeData);

    server.on('tail', function (request) {

        if(httpMethodData[request.method]) {
            httpMethodData[request.method]++;
        } else {
            httpMethodData[request.method] = 1;
        }

        if(statusCodeData[request.response.statusCode]) {
            statusCodeData[request.response.statusCode]++;
        } else {
            statusCodeData[request.response.statusCode] = 1;
        }

        renderBar(screen, statusCodeBar, statusCodeData);
        renderBar(screen, httpMethodBar, httpMethodData);

    });

    return next();

};

exports.register.attributes = {

    pkg: require('../package.json')

};
