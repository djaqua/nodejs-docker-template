"use strict"
/*
 * Author: anjaqua@gmail.com
 * Desription:
 *   Responsible for config.getiguring and initializing the server.
 */
const conf = require('./configuration');
const logger = require('./logging');
const persistence = require('./persistence');

const _ = require('lodash');
const express = require('express');
const path = require('path');


const app = express();
const port = conf('service.port');
const theMenu = '[<a href=\'/create-one\'>create one</a>]' +
                '[<a href=\'/read-them-all\'>read them all</a>]' +
                '[<a href=\'/delete-them-all\'>delete them all</a>]';

logger.notice('Using top level configuration file ' + conf('filename'));

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/delete-them-all', (req, res) => {
  logger.debug('GET /delete-them-all requested');

  let allTodos = persistence.getAllTodos();
  allTodos.exec((err, docs) => {
    if (err) {
      logger.error(err);
    }
    _.forEach( docs, (doc) => {
      persistence.removeTodo(doc._id);
    });
  });

  res.send(theMenu);
});

app.get('/read-them-all', (req, res) => {
  logger.debug('GET /read-them-all requested');

  let allTodos = persistence.getAllTodos();
  allTodos.exec((err, docs) => {
    if (err) {
      logger.error(err);
    }
    _.forEach( docs, (doc) => {
      logger.debug(doc.text);
    });
  });

  res.send(theMenu);
});



app.get('/create-one', (req, res) => {
  logger.debug('GET /create-one requested');

  let foo = persistence.addTodo('Keep on keep\'n on');
  if (foo) {
    logger.debug('created Todo item with id: ' + foo._id);
  }
  else {
    logger.error(err);
  }
  res.send(theMenu);
});


app.get('/complete-one', (req, res) => {
  logger.debug('GET /complete-one requested');

  let foo = persistence.addTodo('Keep on keep\'n on');
  if (foo) {
    logger.debug('completed Todo item with id: ' + foo._id);
  }
  else {
    logger.error(err);
  }
  res.send(theMenu);
});


app.listen(port, (err) => {
  if (err) {
    logger.error('Something went wrong: ', err);
    return;
  }
  logger.notice('Server is listening on ', port);
});
