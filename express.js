(function() {
  'use strict';
  var express = require('express');
  var mongoose = require('mongoose');
  var bodyParser = require('body-parser');
  var logger = require('morgan');

  var Route = require('./models/Routes');

  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(logger('dev'));

  var router = express.Router();

  router.use(function(req, res, next) {
    console.log('PING PING');
    next();
  });

  router.get('/', function(req, res) {
    res.json({message: 'Test message'});
  });

  mongoose.connect('mongodb://admin:admin@localhost:27017/test' +
  '?authSource=test');

  router.route('/data')
  .post(function(req, res) {
    var route = new Route();
    route.points = req.body.points;
    route.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({message: 'Route saved!'});
    });
  });

  app.use('/api', router);

  app.listen(3000, function() {
    console.log('Express server listening on port 3000');
  });
})();
