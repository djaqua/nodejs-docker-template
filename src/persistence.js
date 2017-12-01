
const conf = require('./configuration')('persistance.mongo');
const logger = require('./logging');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(`mongodb://${conf.hostname}:${conf.port}/${conf.dbname}`, {
  useMongoClient: true,
  user: conf.username,
  pass: conf.password
})
.then(() => {
  logger.info("Successfully established a connection to mongo");
})
.catch(err => {
  logger.error(`There was an error connecting to mongo: ${err}`);
  process.exit(1);
});

logger.debug(`mongoose.connection.readyState=${mongoose.connection.readyState}`);


module.exports = {

  /**
   * Represents a document in the 'todos' collection of the template_microservice
   * database.   
   */
  Todo: mongoose.model('Todo', {
    text: String,
    completed: Date,
    created: { type: Date, default: Date.now }
  })
}
