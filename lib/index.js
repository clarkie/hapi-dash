var blessed = require('blessed');
var contrib = require('blessed-contrib');
var _ = require('lodash');

exports.register = function (server, options, next) {

    var screen = blessed.screen();

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

    var httpMethodBar = contrib.bar({
        label: 'HTTP Methods',
        barWidth: 4,
        barSpacing: 6,
        xOffset: 0,
        maxHeight: 9
    });

    var statusCodeBar = contrib.bar({
        label: 'Status Code',
        barWidth: 4,
        barSpacing: 6,
        xOffset: 0,
        maxHeight: 9
    });


    var httpMethodData = {};
    var statusCodeData = {};

    screen.append(httpMethodBar) //must append before setting data
    screen.append(statusCodeBar) //must append before setting data

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
