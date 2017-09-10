/**
 *
 */

var conf = require('./configuration');

var winston = require('winston');
var _ = require('lodash');
var dateFormat = require('dateformat');
var uuid = require('uuid');



if (conf('logging.winston.useColors')) {
  winston.addColors(true);
}

var cache = {
};

/**
 * var createConsoleTransport - description
 *
 * @return {winston.transports.Console}  description
 */
var createConsoleTransport = function() {
  return new (winston.transports.Console)({
    name: uuid.v4(),
    colorize: conf('logging.winston.useColors')
  });
};

/**
 * var getFileTransports - description
 *
 * @return {Array}  an array of Winston File transports
 */
var getFileTransports = function() {
  return _.map( _.values(conf('logging.winston.transports.file')), function(template) {
    return createFileTransport( template );
  } );
};

/**
 * var createFileTransport - creates a new instance of a Winston File
 * transport.
 *
 * @param  {object} template an object to serve as a template for the
 * construction of the Winstron File transport
 * @return {Winston.transports.File} a Winston File transport
 */
var createFileTransport = function(template) {
  var logfile = template.filename ? template.filename : conf('logging.winston.filenames.defaultFilename');
  return new (winston.transports.File)({
    name: uuid.v4(),
    level: template.level,
    showLevel: template.showLevel,
    timestamp: template.timestamp,
    label: template.label,
    filename: getFilenameWithPath(logfile)
  });
};


/**
 * var getFilenameWithPath - description
 *
 * @param  {string} name description
 * @return {string}      description
 */
var getFilenameWithPath = function(name) {
  return getLogsDir() + getFilename(name);
};


/**
 * var getLogsDir - description
 *
 * @return {string}  description
 */
var getLogsDir = function() {
  if (!cache.logsDir) {
    // by contract, conf won't cache default values
    cache.logsDir = conf('logging.winston.filenames.logsDir') + '/';
  }
  return cache.logsDir;
}

/**
 * var getFilename - description
 *
 * @param  {string} logfile the meaningful name for the file ('general',
 * 'errors', etc)
 * @return {string}         the fully formatted filename
 */
var getFilename = function(logfile) {

	if (!cache.logFilenameBuilder) {

    var logfileExtension = conf('logging.winston.filenames.fileExtension');

		if (conf('logging.winston.filenames.useDatedFilenames')) {
			cache.logFilenameBuilder = function(logfile) {
				logfile += '-' + dateFormat(new Date(), conf('logging.winston.filenames.dateFormatStr'));
				logfile += '.' + logfileExtension;
				return logfile;
			};
		}
		else {
			cache.logFilenameBuilder = function(logfile) {
				return logfile + '.' + logfileExtension;
			};
		}
	}
	return cache.logFilenameBuilder(logfile);
};

/**
 * var createNewLogger - creates and returns a new instance of a Winston Logger.
 *
 * @return {Winston.Logger}  a new instance of Winston Logger
 */
var createNewLogger = function() {
  return new (winston.Logger)({
    level: conf('logging.winston.level'),
    levels: conf('logging.winston.levels'),
    transports: _.flattenDeep([getFileTransports(), createConsoleTransport()])
  });
};

/**
 * var getLogger - gets a cached instance of a Winston logger. If there is no
 * instance, then an instance is created, cached, and returned.
 *
 * @return {Winston.Logger}  an instance of Winston Logger
 */
var getLogger = function() {
  if (!cache.logger) {
    cache.logger = createNewLogger();
  }
  return cache.logger;
};

module.exports = getLogger();
