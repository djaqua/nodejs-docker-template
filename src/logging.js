var winston = require('winston');
var _ = require('lodash');
var dateFormat = require('dateformat');
var uuid = require('uuid');

var conf = require('./configuration');

if (conf('logging.winston.useColors')) {
    winston.addColors(true);
}

var createConsoleTransport = function() {
    return new (winston.transports.Console)({
        name: uuid.v4(),
        colorize: conf('logging.winston.useColors')
    });
};

var getFileTransports = function() {
    return _.map( _.values(conf('logging.winston.transports.file')), function(template) {
        return createFileTransport( template );
    } );
};

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

var cache = {
    /*
     * Encapsulates the current conf.red state of the logger. This cache is 
     * intended to save repetitive calls to commonly used objects and 
     * functions. There's probably a better way to keep this stuff "disposable"
     * and out of the anonymous exports, but this works for now.
     */
};

var getFilenameWithPath = function(name) {
   return getLogsDir() + getFilename(name);
};

var getLogsDir = function() {
    if (!cache.logsDir) {
        // by contract, conf won't cache default values
        cache.logsDir = conf('logging.winston.filenames.logsDir', '.') + "/";     
    }
    return cache.logsDir;
}

var getFilename = function(logfile) {

	if (!cache.logFilenameBuilder) {
		
        var logfileExtension = conf('logging.winston.filenames.fileExtension', 
                                    'out');
			
		if (conf('logging.winston.filenames.useDatedFilenames')) {
			cache.logFilenameBuilder = function(logfile) {
				logfile += "-" + dateFormat(new Date(), conf('logging.winston.filenames.dateFormatStr')); 
				logfile += "." + logfileExtension;
				return logfile;
			};
		}
		else {
			cache.logFilenameBuilder = function(logfile) {
				return logfile + "." + logfileExtension;
			};	
		}
	}
	return cache.logFilenameBuilder(logfile);	
};

var createNewLogger = function() {
    // it is NOT the business of this factory method to cache instances 
    // returned.   
    return new (winston.Logger)({
        level: conf('logging.winston.level'),
        levels: conf('logging.winston.levels'),
        transports: _.flattenDeep([getFileTransports(), createConsoleTransport()])
    });
};

module.exports = {
    getLogger : function() {
        if (!cache.logger) {
            cache.logger = createNewLogger();
        }
        return cache.logger;
    }
};
