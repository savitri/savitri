'use strict';

// const Fs = require('fs');
// const _ = require('lodash');

const internals = {};

internals.DEFAULT_EDITION = '1950';

exports.register = (server, options, next) => {

    const Edition = server.plugins['hapi-mongo-models'].Edition;

    server.route({
        method: 'GET',
        path: '/editions',
        handler: (request, reply) => {

            // const editions = [
            //     {
            //         n: '1950',
            //         t: 'First'
            //     },
            //     {
            //         n: '1972',
            //         t: 'Centenary'
            //     },
            //     {
            //         n: '1993',
            //         t: 'Revised'
            //     }
            // ];

            Edition.find({}, { fields: { ed: 1, t: 1, _id: 0 }, sort: { ed: 1 } }, (err, editions) => {

                if (err) {
                    return reply(err);
                }

                reply(editions);
            });
        }
    });

    // server.route({
    //     method: 'POST',
    //     path: '/editions',
    //     config: {
    //         validate: {
    //             payload: Edition.schema
    //         }
    //     },
    //     handler: (request, reply) => {

    //         Edition.insertOne(request.payload, (err, edition) => {

    //             if (err) {
    //                 return reply(err);
    //             }

    //             return reply(edition);
    //         });
    //     }
    // });

    server.route({
        method: 'GET',
        path: '/edition',
        handler: (request, reply) => {

            const filter = {};
            if (request.query.edition) {
                filter.ed = request.query.edition;
            }
            else {
                filter.ed = internals.DEFAULT_EDITION;
            }

            Edition.findOne(filter, (err, results) => {

                if (err) {
                    return reply(err);
                }


                const parts = results.parts.map((part) => {

                    const books = part.books.map((book) => {

                        const cantos = book.cantos.map((canto) => {

                            const sections = canto.sections.map((section) => {

                                return { id: section.id, run: section.run };
                            });

                            return {
                                id: canto.id,
                                n: canto.n,
                                t: canto.t,
                                sections: sections
                            };
                        });

                        return {
                            id: book.id,
                            n: book.n,
                            t: book.t,
                            cantos: cantos
                        };
                    });

                    return {
                        n: part.n,
                        books: books
                    };
                });

                const edition = {
                    ed: results.ed,
                    t: results.t,
                    parts
                };

                reply(edition);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/read/{book}/{canto}/{section}',
        handler: (request, reply) => {

            const filter = {};
            if (request.query.edition) {
                filter.ed = request.query.edition;
            }
            else {
                filter.ed = internals.DEFAULT_EDITION;
            }

            Edition.findOne(filter, (err, results) => {

                if (err) {
                    return reply(err);
                }

                // console.log(results);

                let bookObj;
                let cantoObj;
                let section;
                results.parts.some((part) => {

                    const found = part.books.find((book) => {

                        return book.id === parseInt(request.params.book);
                    });

                    if (found) {
                        bookObj = found;
                        return true;
                    }

                    return;
                });

                cantoObj = bookObj.cantos.find((canto) => canto.id === parseInt(request.params.canto));
                section = cantoObj.sections.find((sec) => sec.id === parseInt(request.params.section));

                section.book = {
                    name: bookObj.n,
                    title: bookObj.t
                };

                section.canto = {
                    name: cantoObj.n,
                    title: cantoObj.t
                };

                section.edition = {
                    name: results.t,
                    year: results.ed
                };

                reply(section);
            });
        }
    });

    next();
};


exports.register.attributes = {
    name: 'edition'
};
