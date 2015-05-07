var blessed = require('blessed');
var contrib = require('blessed-contrib');
var _ = require('lodash');

exports.register = function (server, options, next) {

    var screen = blessed.screen();

    var renderHttpMethodChart = function (s, b, data) {

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


    bar = contrib.bar({
        label: 'HTTP Methods',
        barWidth: 4,
        barSpacing: 6,
        xOffset: 0,
        maxHeight: 9
    });

    var data = { };

    screen.append(bar) //must append before setting data

    renderHttpMethodChart(screen, bar, data);

    server.on('tail', function (request) {

        if(data[request.method]) {
            data[request.method]++;
        } else {
            data[request.method] = 1;
        }

        renderHttpMethodChart(screen, bar, data);

    });

    return next();

};

exports.register.attributes = {

    pkg: require('../package.json')

};
