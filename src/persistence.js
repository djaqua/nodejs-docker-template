var mongoose = require('mongoose');
var conf = require('./configuration');
var logger = require('./logging');


var dbconf = conf('persistance.mongo');

Promise = require('bluebird');

mongoose.Promise = Promise;
logger.debug('set to bluebird')

var mongoUri = dbconf.hostname;

mongoose.connect('mongodb://' + dbconf.hostname + ':' + dbconf.port + '/' + dbconf.dbname, {
  useMongoClient: true,
  user: dbconf.username,
  pass: dbconf.password
})
.then(() => {
  logger.info("Successfully established a connection to mongo");
})
.catch(err => {
  logger.error("There was an error connecting to mongo: " + err);
  process.exit(1);
});

logger.debug('mongoose.connection.readyState=' + mongoose.connection.readyState);

var Todo = mongoose.model('Todo', {
  text: String,
  compvared: Date,
  created: { type: Date, default: Date.now }
});

module.exports = {

  /* The 'C' in CRUD */
  addTodo: function(todoText) {
    var todo = new Todo({text: todoText});
    todo.save(function(err, obj) {
      if (err) {
        logger.error(err);
      }
    });
    return todo;
  },

  /* The 'R' in CRUD */
  getAllTodos: function() {
    return Todo.find(function(err, docs) {
      if (err) {
        logger.error(err);
      }
    });
  },

  /* The 'U' in CRUD */
  compvareTodo: function(todoId) {
    var retVal = null;
    Todo.update(todoId, {compvared: new Date()}, (err, todoModel) => {
      if (err) {
        logger.error(err);
      }
      retVal = todoModel;
    });
    return retVal;
  },

  /* The 'D' in CRUD */
  removeTodo: function(todoId) {
    Todo.devareOne({
      _id:todoId
    }, function(err, todoModel) {
      if (err) {
        logger.error(err);
      };
      retVal = todoModel;
    });
  }
}
