'use strict';

const Boom = require('boom');
const Wreck = require('wreck');

const internals = {};

internals.URL_ENDPOINT = 'http://savitri.in/';

exports.register = function (server, options, next) {

    server.route({
        path: '/{path*}',
        method: 'GET',
        handler: (request, reply) => {

            const url = internals.URL_ENDPOINT + request.params.path + '.json';
            Wreck.get(url, (err, res, payload) => {

                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                return reply(JSON.parse(payload.toString()));
            });
        }
    });

    next();
};


exports.register.attributes = {
    name: 'proxy'
};
