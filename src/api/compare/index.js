'use strict';

const Fs = require('fs');


exports.register = function(server, options, next) {

    const Sentences = server.plugins['hapi-mongo-models'].Sentences;

    server.route({
        method: 'GET',
        path: '/compare/sentence/{refId}',
        handler: (request, reply) => {

            // const fileNames = ['test1972-sentences.json', 'test1993-sentences.json'];

            const refs = [];

            const refId = request.params.refId;
            
            const allRefIds = refId.split(',');

            const filter = { $or: [{ 'sentences.refIds': refId }, { 'sentences.refId': refId }] };
            // const projection = { sentences: { $elemMatch: { $or: [{ refIds: refId }, { refId: refId }] } }, ed: 1, t: 1 };
            const projection = { sort: { ed: 1 } };

            // Sentences.find({}, { $or: [ $includes: { 'sentences.refIds': refId }, { 'sentence.refId': refId } ] }, (err, sentences) => {
            Sentences.find({}, projection, (err, sentences) => {

                if (err) {
                    return reply(err);
                }

                sentences.forEach((sentence) => {

                    let editionMatches = [];

                    editionMatches = sentence.sentences.filter((item) => {
                        // let comp;
                        // item.
                        let matching = false;
                        if (item.refId) {
                            // matching = item.refId === request.params.refId;
                            matching = allRefIds.indexOf(item.refId) !== -1;
                        }
                        else if (item.refIds) {
                            // matching = item.refIds.indexOf(request.params.refId) !== -1;
                            for (const i in allRefIds) {
                                if (item.refIds.indexOf(allRefIds[i]) !== -1) {
                                    matching = true;
                                    break;
                                }
                            }
                            // matching = item.refIds.indexOf(request.params.refId) !== -1;
                        }

                        if (matching) {
                            // item.edition = fileObject.edition;
                            return true;
                        }
                        return false;
                    });

                    if (editionMatches) {
                        refs.push({
                            ed: sentence.ed,
                            t: sentence.t,
                            sentences: editionMatches
                        });
                    }
                });

                reply(refs);

                // sentences.forEach((fileName) => {

                //     // const file = Fs.readFileSync(fileName);
                //     // const fileObject = JSON.parse(file.toString());

                //     let editionMatches = [];

                //     editionMatches = fileObject.sentences.filter((item) => {
                //         // let comp;
                //         // item.
                //         let matching = false;
                //         if (item.refId) {
                //             matching = item.refId === parseInt(request.params.refId);
                //         }
                //         else {
                //             matching = item.refIds.indexOf(parseInt(request.params.refId)) !== -1;
                //         }

                //         if (matching) {
                //             // item.edition = fileObject.edition;
                //             return true;
                //         }
                //         return false;
                //     });

                //     if (editionMatches) {
                //         refs.push({
                //             edition: fileObject.edition,
                //             sentences: editionMatches
                //         });
                //     }
                // });
            });

            // fileNames.forEach((fileName) => {

            //     const file = Fs.readFileSync(fileName);
            //     const fileObject = JSON.parse(file.toString());

            //     let editionMatches = [];

            //     editionMatches = fileObject.sentences.filter((item) => {
            //         // let comp;
            //         // item.
            //         let matching = false;
            //         if (item.refId) {
            //             matching = item.refId === parseInt(request.params.refId);
            //         }
            //         else {
            //             matching = item.refIds.indexOf(parseInt(request.params.refId)) !== -1;
            //         }

            //         if (matching) {
            //             // item.edition = fileObject.edition;
            //             return true;
            //         }
            //         return false;
            //     });

            //     if (editionMatches) {
            //         refs.push({
            //             edition: fileObject.edition,
            //             sentences: editionMatches
            //         });
            //     }
            // });

            // reply(refs);
        }
    });

    // server.route({
    //     method: 'GET',
    //     path: '/compare/line/{refId}',
    //     handler: (request, reply) => {
    //     }
    // });

    next();
};


exports.register.attributes = {
    name: 'compare'
};
