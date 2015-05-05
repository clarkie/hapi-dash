
exports.register = function (server, options, next) {

    return next();

};

exports.register.attributes = {

    pkg: require('../package.json')

};