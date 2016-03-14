'use strict';

const Confidence = require('confidence');


const criteria = {
    env: process.env.NODE_ENV
};


const config = {
    $meta: 'This file configures the plot device.',
    projectName: 'savitri',
    port: {
        api: {
            $filter: 'env',
            test: 9000,
            $default: 8000
        },
        proxy: {
            $filter: 'env',
            test: 9001,
            $default: 8001
        }
    }
};


const store = new Confidence.Store(config);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
