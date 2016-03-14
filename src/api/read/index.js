'use strict';

const Fs = require('fs');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/read/{book}/{canto}/{section}',
        handler: (request, reply) => {

            const query = request.query;
            let fileName;
            let edition = {};
            if (!query.edition || query.edition === '1972') {
                edition = {
                    name: 'Centenary Edition',
                    year: '1972'
                };
            }
            else if (query.edition === '1993') {
                edition = {
                    name: 'Revised Edition',
                    year: '1993'
                };
            }

            fileName = `./test${edition.year}.json`;

            const file = Fs.readFileSync(fileName);
            const fileObject = JSON.parse(file.toString());
            let bookObj;
            let cantoObj;
            let section;
            fileObject.parts.some((part) => {

                bookObj = part.books.find((book) => {

                    return book.id === parseInt(request.params.book);
                });

                cantoObj = bookObj.cantos.find((canto) => canto.id === parseInt(request.params.canto));

                section = cantoObj.sections.find((sec) => sec.id === parseInt(request.params.section));
                return true;
            });

            section.book = {
                name: bookObj.n,
                title: bookObj.t
            };

            section.canto = {
                name: cantoObj.n,
                title: cantoObj.t
            };

            section.edition = edition;

            reply(section);
        }
    });

    next();
};


exports.register.attributes = {
    name: 'read'
};
