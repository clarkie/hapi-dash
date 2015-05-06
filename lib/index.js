var blessed = require('blessed');
var contrib = require('blessed-contrib');

exports.register = function (server, options, next) {

    var screen = blessed.screen();

    var bar = contrib.bar({
        label: 'Server Utilization (%)',
        barWidth: 4,
        barSpacing: 6,
        xOffset: 0,
        maxHeight: 9
    });

    screen.append(bar) //must append before setting data

    bar.setData({ titles: ['bar1', 'bar2'], data: [5, 10] });

    screen.render();

    return next();

};

exports.register.attributes = {

    pkg: require('../package.json')

};
