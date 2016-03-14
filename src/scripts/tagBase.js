'use strict';

const Fs = require('fs');
// const Hoek = require('hoek');
// const _ = require('lodash');
const MongoClient = require('mongodb');

// part > book > canto > section > sentence > line

const args = {};


process.argv.slice(2).forEach((val) => {

    const argKeyValue = val.split('=');
    const key = argKeyValue[0];
    const value = argKeyValue[1];
    args[key] = value;
});


const inputFilePath = args.file;

const fileString = Fs.readFileSync(inputFilePath).toString();

const fileObject = JSON.parse(fileString);

let runningSection = 0;

fileObject.parts.forEach((part, partCounter) => {

    part.books.forEach((book, bookCounter) => {

        book.cantos.forEach((canto, cantoCounter) => {

            canto.sections.forEach((section, sectionCounter) => {

                const sentences = section.txt.split('\n\n');

                const newSentences = sentences.map((sentence, sentenceCounter) => {

                    const newSentence = {};
                    newSentence.id = sentenceCounter + 1;
                    // newSentence.refId = parseInt(_.uniqueId());
                    if (args.base) {
                        newSentence.refId = MongoClient.ObjectId();
                    }

                    const lines = sentence.split('\n');

                    const newLines = lines.map((line, lineCounter) => {

                        const newLine = {};
                        newLine.id = lineCounter + 1;
                        newLine.txt = line;
                        // newLine.refId = parseInt(_.uniqueId());
                        if (args.base) {
                            newLine.refId = MongoClient.ObjectId();
                        }
                        return newLine;
                    });

                    newSentence.lines = newLines;
                    return newSentence;
                });

                delete section.txt;

                section.id = sectionCounter + 1;
                section.run = ++runningSection;
                section.sentences = newSentences;
            });
        });
    });
});

// console.log(Hoek.reach(fileObject, 'parts.0.books.0.cantos.0.sections.0'));

// return;

const data = JSON.stringify(fileObject, null, 2);

Fs.writeFile(`${args.file}.transformed.json`, data, (err) => {

    if (err) {
        console.log(err);
        return;
    }
});
