const mongoose = require('mongoose');
const conf = require('./configuration');
const logger = require('./logging').getLogger();


var dbconf = conf('persistance.mongo');

mongoose.connect('mongodb://' + dbconf.hostname + ':' + dbconf.port + '/' + dbconf.dbname, {
    useMongoClient: true,
    user: dbconf.username,
    pass: dbconf.password
});

logger.debug("mongoose.connection.readyState=" + mongoose.connection.readyState);

var Todo = mongoose.model('Todo', {
    text: String,
    completed: Date,
    created: { type: Date, default: Date.now },
});


/* The 'C' in CRUD */
module.exports = {
    addTodo: function(todoText) {
        var todo = new Todo({text: todoText});
        todo.save(function(err, obj) {
            if (err) {
                logger.error("dammit: " + err);
            }
            logger.debug("good: " + obj);
        });
        return todo;
    },

    /* The 'R' in CRUD */
    getAllTodos: function() {
        return Todo.find(function(err, docs) {
            if (err) {
                logger.debug("dammit, foiled again! " + err);
            }
        });
    },

    /* The 'U' in CRUD */
    completeTodo: function(todoId) {
        var retVal = null;
        Todo.update(todoId, {completed: new Date()}, function(err, todoModel) {
            if (err) {        
                logger.error("dammit: " + err);
            }
            retVal = todoModel;
          
        });
        return retVal;
    },

    /* The 'D' in CRUD */
    removeTodo: function(todoId) {
        Todo.delete({
            _id:todoId
        }, function(err, todoModel) {
            if (err) {
                logger.error("dammit: " + err);
            };
            retVal = todoModel;
        });
    }
}
