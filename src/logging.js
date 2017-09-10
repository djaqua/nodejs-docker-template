/**
 *
 */

const conf = require('./configuration');

const winston = require('winston');
const _ = require('lodash');
const dateFormat = require('dateformat');
const uuid = require('uuid');




if (conf('logging.winston.useColors')) {
  winston.addColors(conf('logging.winston.colors'));
}

const cache = {
};

/**
 * const createConsoleTransport - description
 *
 * @return {winston.transports.Console}  description
 */
const createConsoleTransport = function() {
  return new (winston.transports.Console)({
    name: uuid.v4(),
    colorize: conf('logging.winston.useColors')
  });
};

/**
 * const getFileTransports - description
 *
 * @return {Array}  an array of Winston File transports
 */
const getFileTransports = function() {
  return _.map( _.values(conf('logging.winston.transports.file')), function(template) {
    return createFileTransport( template );
  } );
};

/**
 * const createFileTransport - creates a new instance of a Winston File
 * transport.
 *
 * @param  {object} template an object to serve as a template for the
 * construction of the Winstron File transport
 * @return {Winston.transports.File} a Winston File transport
 */
const createFileTransport = function(template) {
  let logfile = template.filename ? template.filename : conf('logging.winston.filenames.defaultFilename');
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
 * const getFilenameWithPath - description
 *
 * @param  {string} name description
 * @return {string}      description
 */
const getFilenameWithPath = function(name) {
  return getLogsDir() + getFilename(name);
};


/**
 * const getLogsDir - description
 *
 * @return {string}  description
 */
const getLogsDir = function() {
  if (!cache.logsDir) {
    // by contract, conf won't cache default values
    cache.logsDir = conf('logging.winston.filenames.logsDir') + '/';
  }
  return cache.logsDir;
}

/**
 * const getFilename - description
 *
 * @param  {string} logfile the meaningful name for the file ('general',
 * 'errors', etc)
 * @return {string}         the fully formatted filename
 */
const getFilename = function(logfile) {

	if (!cache.logFilenameBuilder) {

    let logfileExtension = conf('logging.winston.filenames.fileExtension');

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
 * const createNewLogger - creates and returns a new instance of a Winston Logger.
 *
 * @return {Winston.Logger}  a new instance of Winston Logger
 */
const createNewLogger = function() {
  return new (winston.Logger)({
    level: conf('logging.winston.level'),
    levels: conf('logging.winston.levels'),
    transports: _.flattenDeep([getFileTransports(), createConsoleTransport()])
  });
};

/**
 * const getLogger - gets a cached instance of a Winston logger. If there is no
 * instance, then an instance is created, cached, and returned.
 *
 * @return {Winston.Logger}  an instance of Winston Logger
 */
const getLogger = function() {
  if (!cache.logger) {
    cache.logger = createNewLogger();
  }
  return cache.logger;
};

module.exports = getLogger();
