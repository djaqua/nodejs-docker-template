/*
 * Author: anjaqua@gmail.com
 * Desription: 
 *   Responsible for configuring and initializing the server.  
 */

const express = require('express');
const conf = require("./configuration");
const logger = require("./logging").getLogger();
logger.notice("Using top level configuration file '" + conf('filename') + "'");
const persistence = require("./persistence");

const app = express();
const port = conf('service.port');

var foo = persistence.addTodo("Keep on keep'n on");
if (foo) {
    logger.debug("woot!");
    logger.debug("foo._id: " + foo._id);
}
else {
    logger.debug("dammit!! foo: '" + foo + "'");
}

var allTodos = persistence.getAllTodos();
logger.debug("All todos: " + allTodos);
allTodos.exec(function(err, docs) {
    for (i = 0; i < docs.length; i++) {
        logger.info(docs[i].text);
                
    }
});


app.get('/', (req, res) => {
    var foo = persistence.addTodo("Keep on keep'n on");
    logger.debug('GET / requested');
    if (foo) {
        logger.debug("woot!");
        logger.debug("foo._id: " + foo._id);
    }
    else {
        logger.debug("dammit!! foo: '" + foo + "'");
    }
    res.send("Hello, world!");
});

app.listen(port, (err) => {
    if (err) {
        logger.error("Something went wrong: ", err);
        return;
    }
    logger.notice("Server is listening on ", port);
});

