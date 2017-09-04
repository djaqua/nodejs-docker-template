const mongoose = require('mongoose');
const conf = require('./configuration');
const logger = require('./logging').getLogger();


var mongo = conf('persistance.mongo');

mongoose.connect('mongodb://' + mongo.hostname + ':' + mongo.port + '/' + mongo.dbname, {
//mongoose.connect('mongodb://' + mongo.hostname + ':' + mongo.port + '/' + mongo.dbname + '?authSource=' + mongo.authdb + '&authMechanism=SCRAM-SHA-1', {
    user: mongo.username,
    pass: mongo.password
});

logger.debug("mongoose.connection.readyState=" + mongoose.connection.readyState);

/*
module.Todo = mongoose.model('Todo', {
    text: String
});


module.exports = function(app) {

    // TODO design a better api than this
    
    app.get('/api/todos', (req, res) => {
        Todo.find( (err, todos) => {
            if (err) {
                logging.error(err);
                return res.send(err);
            }
            res.json(todos);
        });
    });

    app.post('/api/todos', (req, res) => {
        Todo.create({
            text: req.body.text,
            done: false
        }, (err, todo) => {
            if (err) {
                return res.send(err);
            }
            Todo.find((err, todos) = {
                if (err) {
                    return res.send(err);
                }
                res.json(todos);
            });
        });
        
    });

    app.delete('/api/todos/:todo_id', (req, res) => {
        Todo.remove({
            _id: req.params.todo_id
        }, (err, todo) => {
            if (err) {
                logging.error(err);
                return res.send(err);
            }
            Todo.find((err, todos) => {
                if (err) {
                    logging.error(err);
                    return res.send(err);
                }
                res.json(todos);
            });
        });
    });
};
*/
