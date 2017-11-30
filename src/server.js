/*
 * Author: anjaqua@gmail.com
 * Desription:
 *   Responsible for config.getiguring and initializing the server.
 */
const conf = require('./configuration');
const logger = require('./logging');
const {
  Todo
} = require('./persistence');

const _ = require('lodash');
const express = require('express');
const path = require('path');
const app = express();
const port = conf('service.port');

logger.notice(`Using top level configuration file ${conf('filename')}`);

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/all', (req, res) => {
  logger.debug('GET /all requested');
  Todo.find({}, function (err, docs) {
    if (err) {
      logger.error(err);
    }
    res.send(JSON.stringify(docs));

  });
});

app.post('/create/:text', (req, res) => {
  logger.debug('POST /create requested');
  const text = req.params.text;

  let todo = new Todo({text: text});
  todo.save(function(err, obj) {
    if (err) {
        res.send(`{"error":"${err}"}`);
    }
    res.send(`{"result":"ok"}`);
  });

});

app.put('/updateText/:id/:text', (req, res) => {

  logger.debug('PUT /updateText requested');

  const {
    id,
    text
  } = req.params;

  logger.debug("req.params.id: " + id);
  logger.debug("req.params.text: " + text);

  Todo.findById(id, function (err, doc) {
    if (err) {
      logger.error(err);
      res.send(`{"error":"${err}"}`);
    }
    else {
      doc.text = text;
      doc.save();
      res.send(`{"result":"ok"}`);
    }
  });
});

app.put('/complete/:id', (req, res) => {

  logger.debug('PUT /complete requested');

  const id = req.params.id;

  logger.debug("req.params.id: " + id);

  Todo.findById(id, function (err, doc) {

    if (err) {
      logger.error(err);
      res.send(`{"error":"${err}"}`);
    }
    else {
      doc.completed = new Date();
      doc.save();
      res.send(`{"result":"ok"}`);
    }
  });
});

app.listen(port, (err) => {
  if (err) {
    logger.error('Something went wrong: ', err);
    return;
  }
  logger.notice('Server is listening on ', port);
});
