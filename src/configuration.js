var config = require('config');

/* 
   Configuration theory of operation:
        1 - prefer dynamic parameters to the static parameters

            a. command line parameters are preferred over environment variables
            b. environment variables are preferred over configuration file parameters
            c. configuration file parameters are prefered over hard-coded/ values 

            hard coded  <  config files  <  environment  <  CLI parameters
*/

var cache = {
    
};


var yargs = require("yargs")
    .string("loglevel")
        .check( function(argv) {
            if (argv.loglevel) {
                config.logging.winston.level = argv.loglevel;  // (1.a & 1.b) 
            }
            return true;
        })  // end --loglevel check
    .string("str")
        .check( function(argv) {
            if (argv.str) {
                config.strProperty = argv.str;
            }
            return true;
        }) // end --str check
    .string("num")
        .check( function(argv) {
            if (argv.num) {
                config.numProperty = argv.num;
            }
            return true;
        }) // end --num check
    .string("nullprop")
        .check( function(argv) {
            if (argv.nullprop) {
                console.log("setting config.nullProperty=", argv.nullprop);
                config.nullProperty = argv.nullprop;
            }
            return true;
        }) // end --null check
    .string("na")
        .check( function(argv) {
            if (argv.na) {
                config.naProperty = argv.na;
            }
            return true;
        }) // end --num check
    .argv;


module.exports = function(confStr, defaultValue) {
    if (!cache[confStr]) {
        // using exceptions instead of checking is generally 
        // frowned upon, but the nature of these conditions would 
        // require redundancy that wouldn't justify the performance
        // gain at the cost of readability 
        try {
            conf = config.get(confStr); // assume its there
        } catch(e) {
            // if its not, no big deal 
        }
        if (!conf) {
            conf = defaultValue; 
        }
        cache[confStr] = conf;
    }
    return cache[confStr];  
};

