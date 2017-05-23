var winston = require('winston');
var _ = require('lodash');
var dateFormat = require('dateformat');
var uuid = require('uuid');

var conf = require('./configuration').getConfig().logging;

if (conf.winston.useColors) {
    winston.addColors(conf.winston.colors);
}

var createConsoleTransport = function() {
    return new (winston.transports.Console)({
        name: uuid.v4(),
        colorize: conf.winston.useColors
    });
};

var getFileTransports = function() {
    return _.map( _.values(conf.winston.transports.file), function(template) {
        return createFileTransport( template );
    } );
};

var createFileTransport = function(template) {
    var logfile = template.filename ? template.filename : conf.winston.filenames.defaultFilename;
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



var getLogsDir = function() {
    if (!cache.logsDir) {
        cfgLogsDir = conf.winston.filenames.logsDir;     
		cache.logsDir = (cfgLogsDir ? cfgLogsDir : ".");
	}
    return cache.logsDir;
}

var getFilenameWithPath = function(name) {
   return getLogsDir() + "/" + getFilename(name);
};

var getFilename = function(logfile) {

	if (!cache.logFilenameBuilder) {
		
        var cfgFileExtension = conf.winston.filenames.fileExtension;
		var logfileExtension = (cfgFileExtension ? cfgFileExtension : "out");
			
		if (conf.winston.filenames.useDatedFilenames) {
			cache.logFilenameBuilder = function(logfile) {
				logfile += "-" + dateFormat(new Date(), conf.winston.filenames.dateFormatStr); 
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
        level: conf.winston.level,
        levels: conf.winston.levels,
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

