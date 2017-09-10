var config = require('config');
var _ = require('lodash');


/**
 * var cache - the cache for the configuration system.
 */
var cache = {
};

/**
 * The values of the command line arguments.
 */
var yargs = require('yargs')
  .string('loglevel')
  .describe('loglevel', 'Set the level for the logging system')
  .choices('loglevel', _.keys(config.get('logging.winston.levels')))
  .string('logdir')
  .describe('logdir', 'Set the log directory to place the logfiles in')
  .help('help')
  .argv;


/**
 * var get - a function that returns the prioritized value that corresponds
 * to the specified configuration key. The key is assumed to be a dot dilimited
 * key suitable for node-config. The prioritized values are determines by the
 * following rules:
 *
 *   a. command line parameters are preferred over environment variables
 *   b. environment variables are preferred over configuration file parameters
 *   c. configuration file parameters are prefered over hard-coded/ values
 *
 * @param  {string} cfgKey a key for which to get an environment variable
 * @return {string}        the value of the environment variable
 */
var getPrioritizedValue = function(cfgKey) {

  var argKey = null;
  var envKey = null;
  var value = null;

  //
  // Process the keys to get their corresponding alter-keys
  //
  if ('logging.winston.level' === cfgKey) {
    argKey = 'loglevel';
    envKey = 'TEMPLATE_MICROSERVICE_LOG_LEVEL';
  }
  else if ('logging.winston.filenames.logsDir' === cfgKey) {
    argKey = 'logdir';
    envKey = 'TEMPLATE_MICROSERVICE_LOG_DIR'
  }

  //
  // Get the value of the key by priority
  //
  if (argKey) {
    value = yargs[argKey];
  }
  if (!value && envKey) {
    value = process.env[envKey];
  }
  if (!value && cfgKey) {
    value = config.get(cfgKey);
  }

  return value;
}

/**
 * module - A function that can be used to retrieve configuration values by
 * configuration key. This function uses a cache.
 *
 * @param  {string} key          a key to get a configuration value for
 * @param  {string} defaultValue the hard-coded value to be used if there is
 *                               no configuration value for the specified key
 * @return {string}              a configuration value for the specified key
 */
module.exports = function(key, defaultValue) {
  if (key) {
    if (!cache[key]) {
      cache[key] = getPrioritizedValue(key);
    }
    return cache[key];
  }
};
