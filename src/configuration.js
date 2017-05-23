var config = require('config');

/* 
   Configuration theory of operation:
        1 - prefer dynamic parameters to the static parameters

            a. command line parameters are preferred over environment variables
            b. environment variables are preferred over configuration file parameters

            hard coded  <  config files  <  environment  <  CLI parameters
*/

var yargs = require("yargs")
    .string("loglevel")
        .check( function(argv) {
            if (argv.loglevel) {
                config.logging.winston.level = argv.loglevel;  // (1.a & 1.b) 
            }
            return true;
        })  // end level check
    .argv;


module.exports = {
    
    filename: config.filename,

    logging: config.logging,

    getConfig : function() {
        return config;
    }
};
