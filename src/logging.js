var winston = require('winston');
var _ = require('lodash');
var dateFormat = require('dateformat');
var uuid = require('uuid');

var config = require('./konf').getConfig().logging;
var cache = {};

if (config.useColors) {
    winston.addColors(config.colors);
}

var createConsoleTransport = function() {
    return new (winston.transports.Console)({
        name: uuid.v4(),
        colorize: true
    });
};

var createFileTransport = function(level) {
    
    var filenameWithPath = getFilenameWithPath(level);

	return new (winston.transports.File)({
      name: level + '-file',
      filename: filenameWithPath,
      level: level
    });
};

var getLogsDir = function() {
    if (!cache.logsDir) {
		 cache.logsDir = (config.logsDir ? config.logsDir : ".");
	}
    return cache.logsDir;
}

var getFilenameWithPath = function(level) {
   return getLogsDir() + "/" + getFilename(level);
};

var getFilename = function(level) {
    
	var logfile = config.files[level] ? config.files[level] : config.defaultLogfile;

	if (!cache.logFilenameBuilder) {
		
		var logfileExtension = (config.fileExtension ? config.fileExtension : "out");
			
		if (config.useDatedFilenames) {
			cache.logFilenameBuilder = function(logfile) {
				logfile += "-" + dateFormat(new Date(), config.dateFormatStr); 
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

module.exports = {
    
    getLogLevels : function() {
        if (!cache.logLevels) {
            cache.logLevels = _.keys(config.levels);
        }
        return cache.logLevels;
    },

    getLogger : function() {
        if (!cache.logger) {
         
            var fileTransports = _.map(this.getLogLevels(), function(level) {
                return createFileTransport(level);
            });

            cache.logger = new (winston.Logger)({
                level: config.level,
                levels: config.levels,
                transports: _.flattenDeep([fileTransports, createConsoleTransport()])
            });
        }
        return cache.logger;
    }

};

