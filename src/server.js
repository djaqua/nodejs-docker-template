/*
 * Author: anjaqua@gmail.com
 * Desription: 
 *   Responsible for configuring and initializing the server.  
 */

var conf = require("./configuration");

// TODO: make sure logging picks up the changes from configuration
var logger = require("./logging").getLogger();

logger.notice("Using top level configuration file '" + conf('filename') + "'");

//console.log( "conf('logging.winston.level'): ", conf('logging.winston.level') );
//console.log( "conf('logging.winston.level', 'ting'): ", conf('logging.winston.level', 'bar') );

//console.log( "conf('numProperty'): ", conf('numProperty'));
//console.log( "conf('numProperty', 27): ", conf('numProperty', 27));


//console.log( "conf('strProperty'): ", conf('strProperty'));
//console.log( "conf('strProperty', 'bye bye'): ", conf('strProperty', 'bye bye'));


//console.log( "conf('nullProperty'): ", conf('nullProperty'));
//console.log( "conf('nullProperty', 'good times'): ", conf('nullProperty', 'good times'));

//console.log( "conf('naProperty'): ", conf('naProperty'));
//console.log( "conf('naProperty', 'good times'): ", conf('naProperty', 'good times'));





setInterval(function() {
    logger.debug("heartbeat (debug)");
}, 10000);

