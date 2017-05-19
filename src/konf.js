var config = require('config');

/* 
   Configuration theory of operation:
        1 - prefer dynamic parameters to the static parameters
*/

var yargs = require("yargs")
    .string("port")
        .check( function(argv) {
            if (!argv.port) {
                    argv.port = config.port;
            }
            return true;
        })  // end port check
    .argv;


module.exports = {

    getPort : function() {
        return yargs.port;
    },

    getConfig : function() {
        return config;
    }
};
