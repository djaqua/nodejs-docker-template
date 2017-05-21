/*
 * Author: anjaqua@gmail.com
 * Desription: 
 *   Responsible for configuring and initializing the server. Provides the 
 */

var config = require("./konf").getConfig();

var logger = require("./logging").getLogger();
logger.notice("Using top level configuration file '" + config.filename + "'");


setInterval(function() {
    logger.info("heartbeat");
}, 10000);

