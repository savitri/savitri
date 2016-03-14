'use strict';

const Joi = require('joi');
const MongoClient = require('mongodb').MongoClient;

const Sentences = require('../models/sentences');
const SABCL = require('../../Savitri_First_tagged-sentences.json');

const url = 'mongodb://localhost:27017/savitri';

MongoClient.connect(url, (err, db) => {

    if (err) {
        console.error(err);
    }

    const coll = db.collection('sentences');

    Joi.validate(SABCL, Sentences.schema, { allowUnknown: true, abortEarly: false }, (err, value) => {

        // if (err) {
        //     console.error(err);
        //     db.close();
        //     return;
        // }

        // console.log('valid input');
        coll.insert(SABCL, (err, edition) => {

            if (err) {
                console.error(err);
            }

            console.log('done');
            db.close();
        });
    });
});

// Edition.insertOne(SABCL, (err, edition) => {

//     if (err) {
//         console.error(err);
//     }

//     console.log('done');
// });
