/*
 * Author: anjaqua@gmail.com
 * Desription: 
 *   Responsible for configuring and initializing the server. Provides the 
 */

var conf = require("./configuration");

// TODO: make sure logging picks up the changes from configuration
var logger = require("./logging").getLogger();

logger.notice("Using top level configuration file '" + conf.filename + "'");

setInterval(function() {
    logger.debug("heartbeat (debug)");
}, 10000);

