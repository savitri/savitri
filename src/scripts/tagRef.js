'use strict';

const Fs = require('fs');
const Leven = require('leven');

const TagUtils = require('./utils');
const base = JSON.parse(Fs.readFileSync('Savitri_first.json').toString());
const target = JSON.parse(Fs.readFileSync('28_Savitri_1.js.json.transformed.json').toString());
// const base = JSON.parse(Fs.readFileSync('base.json').toString());
// const target = JSON.parse(Fs.readFileSync('target.json').toString());
const targetTag = 'done';
const baseTag = 'done';

const targetSentenceIterator = TagUtils.getNextUntaggedSentence(target, targetTag);
let generatedTargetSentence = targetSentenceIterator.next();
let targetLineIterator;
let generatedTargetLine;

let baseSentenceIterator = TagUtils.getNextUntaggedSentence(base, baseTag);
let generatedBaseSentence = baseSentenceIterator.next();
let generatedBaseLine;

let baseLineIterator = TagUtils.getNextUntaggedLine(generatedBaseSentence.value, baseTag);

const setRefId = (targetSentence, targetLine, baseLine) => {

    console.log(targetSentence.id);

    // assign v1's ref to v2's ref
    targetLine.refId = baseLine.refId;

    // push v1's sentence refId to v2's sentence refId
    const baseSentence = generatedBaseSentence.value;

    if (!targetSentence.refIds) {
        targetSentence.refIds = [];
    }

    if (targetSentence.refIds.indexOf(baseSentence.refId) === -1) {
        targetSentence.refIds.push(baseSentence.refId);
    }

    // mark v1 and v2 lines done
    // targetLine[targetTag] = true;
    baseLine[baseTag] = true;

    const untaggedBaseLines = baseSentence.lines.filter((line) => typeof line[baseTag] === 'undefined');

    // if all lines in v1 are done, mark v1 sentence done
    if (!untaggedBaseLines.length) {
        baseSentence[baseTag] = true;
    }

    // get iterators for next cycle
    generatedTargetLine = targetLineIterator.next();
    generatedBaseLine = baseLineIterator.next();
};


const resetBaseIterators = () => {

    baseLineIterator.next(false);
    baseSentenceIterator.next(false);
    baseSentenceIterator = TagUtils.getNextUntaggedSentence(base, baseTag);
    generatedBaseSentence = baseSentenceIterator.next();
    if (!generatedBaseSentence.done) {
        baseLineIterator = TagUtils.getNextUntaggedLine(generatedBaseSentence.value, baseTag);
    }
    else {
        baseLineIterator = null;
    }
};


while (!generatedTargetSentence.done) {
    const targetSentence = generatedTargetSentence.value;

    targetLineIterator = TagUtils.getNextUntaggedLine(targetSentence, targetTag);

    generatedTargetLine = targetLineIterator.next();

    while (!generatedTargetLine.done) {
        const targetLine = generatedTargetLine.value;

        if (!baseLineIterator) {
            // in case all base sentences are exhausted
            continue;
        }

        generatedBaseLine = baseLineIterator.next();
        let baseLine = generatedBaseLine.value;

        let matchingBaseLine;

        let ld = Leven(targetLine.txt, baseLine.txt);

        if (ld > 14) {
            // if ld > 14, reset base iterators
            resetBaseIterators();

            // iterate through entire v1 to find a better match
            while (!generatedBaseSentence.done) {
                const baseSentence = generatedBaseSentence.value;
                baseLineIterator = TagUtils.getNextUntaggedLine(baseSentence, baseTag);
                generatedBaseLine = baseLineIterator.next();
                while (!generatedBaseLine.done) {
                    baseLine = generatedBaseLine.value;
                    ld = Leven(targetLine.txt, baseLine.txt);
                    if (ld <= 14) {
                        matchingBaseLine = baseLine;
                        break;
                    }
                    else {
                        generatedBaseLine = baseLineIterator.next();
                    }
                }

                if (matchingBaseLine) {
                    break;
                }
                else {
                    generatedBaseSentence = baseSentenceIterator.next();
                }
            }
        }

        if (ld <= 14 || matchingBaseLine) {
            setRefId(targetSentence, targetLine, baseLine);
        }
        else {
            generatedTargetLine = targetLineIterator.next();
        }

        resetBaseIterators();
    }

    generatedTargetSentence = targetSentenceIterator.next();
}


Fs.writeFileSync('output.json', JSON.stringify(target, null, 2));
