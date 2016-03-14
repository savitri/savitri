'use strict';

const Assign = require('lodash/assign');
const BaseModel = require('hapi-mongo-models').BaseModel;
const Joi = require('joi');

const Edition = BaseModel.extend({
    constructor: function (attrs) {

        Assign(this, attrs);
    }
});

Edition._collection = 'editions';

// parts > books > cantos > sections > sentences > lines

Edition.schema = Joi.object().keys({
    t: Joi.string().required(),
    subt: Joi.string().required(),
    autn: Joi.string().required(),
    parts: Joi.array().required().items(
        Joi.object().keys({
            n: Joi.string().required(),
            books: Joi.array().required().items(
                Joi.object().required().keys({
                    id: Joi.number().required(),
                    n: Joi.string().required(),
                    t: Joi.string().required(),
                    cantos: Joi.array().required().items(
                        Joi.object().required().keys({
                            id: Joi.number().required(),
                            n: Joi.string().required(),
                            t: Joi.string().required(),
                            sections: Joi.array().required().items(
                                Joi.object().required().keys({
                                    id: Joi.number().required(),
                                    run: Joi.number().required(),
                                    sentences: Joi.array().required().items(
                                        Joi.object().required().keys({
                                            id: Joi.number().required(),
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
                                })
                            )
                        })
                    )
                })
            )
        })
    )
});

module.exports = Edition;
