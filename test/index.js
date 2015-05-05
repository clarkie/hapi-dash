var Hapi = require('hapi');
var Lab = require('lab');
var Code = require('code');

var lab = exports.lab = Lab.script();
var expect = Code.expect;
var describe = lab.describe;
var it = lab.it;

describe('Plugin', function () {

    it('should register with hapi server', function (done) {

        var server = new Hapi.Server();

        var plugin = {
            register: require('..'),
            options: {}
        };

        server.register(plugin, function (err) {

            expect(err).to.not.exist();

            return done();
        });
    });
});
