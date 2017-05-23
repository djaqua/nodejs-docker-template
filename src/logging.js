var winston = require('winston');
var _ = require('lodash');
var dateFormat = require('dateformat');
var uuid = require('uuid');

var config = require('./konf').getConfig().logging;
var cache = {};

if (config.winston.useColors) {
    winston.addColors(config.winston.colors);
}

var createConsoleTransport = function() {
    return new (winston.transports.Console)({
        name: uuid.v4(),
        colorize: config.winston.useColors
    });
};

var getFileTransports = function() {
    return _.map( _.values(config.winston.transports.file), function(template) {
        return createFileTransport( template );
    } );
};

var createFileTransport = function(template) {
    var logfile = template.filename ? template.filename : config.winston.filenames.defaultFilename;
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
     * Encapsulates the current configured state of the logger. This cache is 
     * intended to save repetitive calls to commonly used objects and 
     * functions. There's probably a better way to keep this stuff "disposable"
     * and out of the anonymous exports, but this works for now.
     */
};



var getLogsDir = function() {
    if (!cache.logsDir) {
        cfgLogsDir = config.winston.filenames.logsDir;     
		cache.logsDir = (cfgLogsDir ? cfgLogsDir : ".");
	}
    return cache.logsDir;
}

var getFilenameWithPath = function(name) {
   return getLogsDir() + "/" + getFilename(name);
};

var getFilename = function(logfile) {

	if (!cache.logFilenameBuilder) {
		
        var cfgFileExtension = config.winston.filenames.fileExtension;
		var logfileExtension = (cfgFileExtension ? cfgFileExtension : "out");
			
		if (config.winston.filenames.useDatedFilenames) {
			cache.logFilenameBuilder = function(logfile) {
				logfile += "-" + dateFormat(new Date(), config.winston.filenames.dateFormatStr); 
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
        level: config.winston.level,
        levels: config.winston.levels,
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

