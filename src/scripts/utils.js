'use strict';


const getNextUntaggedSentence = function* (edition, tagName) {

    let sentences = [];

    edition.parts.forEach((part) => {

        part.books.forEach((book) => {

            book.cantos.forEach((canto) => {

                canto.sections.forEach((section) => {

                    sentences = sentences.concat(section.sentences.filter((sentence) => {

                        return typeof sentence[tagName] === 'undefined';
                    }));
                });
            });
        });
    });


    if (!sentences.length) {
        return;
    }

    // console.log(sentences);
    for (const sentence of sentences) {
        const getNext = yield sentence;
        if (getNext === false) {
            break;
        }
    }

    return;
};


const getNextUntaggedLine = function* (sentence, tagName) {

    const lines = sentence.lines.filter((line) => {

        return typeof line[tagName] === 'undefined';
    });

    if (!lines.length) {
        return;
    }

    for (const line of lines) {
        const getNext = yield line;
        if (getNext === false) {
            break;
        }
    }

    return;
};


module.exports = {
    getNextUntaggedSentence,
    getNextUntaggedLine
};
