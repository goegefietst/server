(function() {
  'use strict';
  var express = require('express');
  var mongoose = require('mongoose');
  var bodyParser = require('body-parser');
  var logger = require('morgan');

  var Route = require('./models/Routes');
  var User = require('./models/Users');

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
    res.json({
      message: 'Test message'
    });
  });

  mongoose.connect('mongodb://admin:admin@localhost:27017/test' +
    '?authSource=test');

  router.route('/data')
    .post(function(req, res) {
      var params = {};
      params.res = res;
      params.req = req;
      userExists(req.body.userId, params, saveRoute, error);
    });

  router.route('/user')
    .post(function(req, res) {
      if (req.body.userId) {
        //TODO
      } else {
        var params = {};
        params.res = res;
        generateUser(params);
      }
    });

  app.use('/api', router);

  app.listen(3000, function() {
    console.log('Express server listening on port 3000');
  });

  function error(params) {
    params.res.json({
      message: 'Something went wrong...'
    });
  }

  function generateUser(params) {
    var user = new User();
    user.guid = generateUUID();
    userExists(user.guid, params, generateUser, save);

    function save(params) {
      user.save(function(err) {
        if (err) {
          params.res.send(err);
        }
        params.res.json({
          message: 'UserId generated!',
          userId: user.guid
        });
      });
    }
  }

  function saveRoute(params) {
    var route = new Route();
    route.userId = params.req.body.userId;
    route.points = params.req.body.points;
    route.save(function(err) {
      if (err) {
        params.res.send(err);
      }
      params.res.json({
        message: 'Route saved for ' + route.userId
      });
    });
  }

  function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  function userExists(guid, params, yes, no) {
    User.find({
      'guid': guid
    }, check);

    function check(err, docs) {
      if (err) {
        console.log(err);
      }
      if (docs.length) {
        yes(params);
      } else {
        no(params);
      }
    }
  }

})();
