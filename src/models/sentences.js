'use strict';

const Assign = require('lodash/assign');
const BaseModel = require('hapi-mongo-models').BaseModel;
const Joi = require('joi');

const Sentences = BaseModel.extend({
    constructor: function (attrs) {

        Assign(this, attrs);
    }
});

Sentences._collection = 'sentences';

// {
//   "ed": "1993",
//   "t": "Revised Edition",
//   "sentences": [
//     {
//       "id": 1,
//       "lines": [
//         {
//           "id": 1,
//           "txt": "It was the hour before the Gods awake.",
//           "refId": "56daab5c7d970157a922075e"
//         }
//       ],
//       "refIds": [
//         "56daab5c7d970157a922075d"
//       ],
//       "ref": "1.1"
//     }
//   ]
// }

// parts > books > cantos > sections > sentences > lines

Sentences.schema = Joi.object().keys({
    ed: Joi.string().required(),
    t: Joi.string().required(),
    sentences: Joi.array().required().items(
        Joi.object().required().keys({
            id: Joi.number().required(),
            ref: Joi.string().required(),
            refIds: Joi.array().required(),
            lines: Joi.array().required().items(
                Joi.object().required().keys({
                    id: Joi.number().required(),
                    refId: Joi.string().required(),
                    txt: Joi.string().required()
                })
            )
        })
    )
});

module.exports = Sentences;
