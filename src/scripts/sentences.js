'use strict';

const Fs = require('fs');

const file = 'Savitri_First_tagged';

const Edition = require(`../../${file}.json`);

const o = {};
let sentences = [];

Edition.parts.forEach((part) => {

    part.books.forEach((book) => {

        book.cantos.forEach((canto) => {

            canto.sections.forEach((section) => {

                const s = section.sentences.map((sentence) => {
                    sentence.ref = section.run + '.' + sentence.id;
                    return sentence;
                });

                sentences = sentences.concat(s);
            });
        });
    });
});

o.ed = Edition.ed;
o.t = Edition.t;
o.sentences = sentences;

Fs.writeFileSync(`${ file }-sentences.json`, JSON.stringify(o, null, 2));
