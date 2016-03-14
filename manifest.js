'use strict';

const Confidence = require('confidence');
const Config = require('./config');


const criteria = {
    env: process.env.NODE_ENV
};


const manifest = {
    $meta: 'This file defines the plot device.',
    server: {
        debug: {
            request: ['error']
        },
        connections: {
            routes: {
                security: true,
                cors: true
            }
        }
    },
    connections: [{
        port: Config.get('/port/api'),
        labels: ['api']
    }, {
        port: Config.get('/port/proxy'),
        labels: ['proxy']
    }],
    registrations: [
        {
            plugin: {
                register: 'hapi-mongo-models',
                options: {
                    mongodb: {
                        url: 'mongodb://localhost:27017/savitri'
                    },
                    models: {
                        'Edition': './src/models/edition',
                        'Sentences': './src/models/sentences'
                    }
                }
            }
        },
        {
            plugin: './src/api/proxy',
            options: {
                select: 'proxy',
                routes: {
                    prefix: '/api'
                }
            }
        },
        // {
        //     plugin: './src/api/read',
        //     options: {
        //         select: 'api',
        //         routes: {
        //             prefix: '/api'
        //         }
        //     }
        // },
        {
            plugin: './src/api/edition',
            options: {
                select: 'api',
                routes: {
                    prefix: '/api'
                }
            }
        },
        {
            plugin: './src/api/compare',
            options: {
                select: 'api',
                routes: {
                    prefix: '/api'
                }
            }
        }
    ]
};


const store = new Confidence.Store(manifest);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
