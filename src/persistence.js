const mongoose = require('mongoose');
const conf = require('./configuration');
const logger = require('./logging');


const dbconf = conf('persistance.mongo');

mongoose.connect('mongodb://' + dbconf.hostname + ':' + dbconf.port + '/' + dbconf.dbname, {
  useMongoClient: true,
  user: dbconf.username,
  pass: dbconf.password
});

logger.debug('mongoose.connection.readyState=' + mongoose.connection.readyState);

const Todo = mongoose.model('Todo', {
  text: String,
  completed: Date,
  created: { type: Date, default: Date.now },
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
  completeTodo: function(todoId) {
    var retVal = null;
    Todo.update(todoId, {completed: new Date()}, (err, todoModel) => {
      if (err) {
        logger.error(err);
      }
      retVal = todoModel;
    });
    return retVal;
  },

  /* The 'D' in CRUD */
  removeTodo: function(todoId) {
    Todo.deleteOne({
      _id:todoId
    }, function(err, todoModel) {
      if (err) {
        logger.error(err);
      };
      retVal = todoModel;
    });
  }
}
