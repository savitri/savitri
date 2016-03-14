'use strict';

const Fs = require('fs');
// const Hoek = require('hoek');

const args = {};


process.argv.slice(2).forEach((val) => {

    const argKeyValue = val.split('=');
    const key = argKeyValue[0];
    const value = argKeyValue[1];
    args[key] = value;
});

const inputFilePath = args.file;

const fileString = Fs.readFileSync(inputFilePath).toString();

const fileObject = eval(fileString); //eslint-disable-line no-eval

// console.log(Hoek.reach(fileObject, 'parts.0.books.0.cantos.0.t'));

fileObject.parts = fileObject.parts.map((part) => {

    part.books = part.books.map((book) => {

        book.cantos = book.cantos.map((canto) => {

            canto.sections = [];
            const sectionText = canto.txt.split('\n\n---\n\n');
            sectionText.forEach((text) => {

                canto.sections.push({
                    txt: text
                });
            });

            delete canto.txt;

            return canto;
        });

        return book;
    });

    return part;
});

Fs.writeFileSync(args.file + '.json', JSON.stringify(fileObject, null, 2));
