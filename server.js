'use strict';

const Composer = require('./index');


Composer((err, server) => {

    if (err) {
        throw err;
    }

    server.start(() => {

        console.log('Started the plot device on port(s) ' + server.connections.map((serv) => serv.info.port));
    });
});
