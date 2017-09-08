/*
 * Author: anjaqua@gmail.com
 * Desription: 
 *   Responsible for configuring and initializing the server.  
 */

const express = require('express');
const conf = require("./configuration");
const logger = require("./logging").getLogger();
logger.notice("Using top level configuration file '" + conf('filename') + "'");
const path = require('path');
const app = express();
const port = conf('service.port');

//app.use(express.static('src/public'));
app.use('/', express.static(path.join(__dirname, 'public')));

/*
app.get('/', (req, res) => {
    logger.debug('GET / requested');
    res.send("Hello, world!");
});
*/
app.listen(port, (err) => {
    if (err) {
        logger.error("Something went wrong: ", err);
        return;
    }
    logger.notice("Server is listening on ", port);
});

