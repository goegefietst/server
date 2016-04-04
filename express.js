(function() {
  'use strict';
  var express = require('express');
  var mongoose = require('mongoose');
  var bodyParser = require('body-parser');
  var logger = require('morgan');
  var crypto = require('crypto');

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
    next();
  });

  app.use(express.static(__dirname + '/public'));

  router.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
  });

  mongoose.connect('mongodb://admin:admin@localhost:27017/test' +
    '?authSource=test');

  router.route('/user/:uuid')
    .post(function(req, res) {
      var params = {};
      params.res = res;
      params.req = req;
      params.uuid = req.params.uuid;
      checkUserInfo(req.params.uuid, req.body.secret, params, saveRoute, notFound);
    });

  router.route('/user')
    .post(function(req, res) {
      if (req.body.uuid) {
        //TODO
      } else {
        var params = {};
        params.res = res;
        generateUser(params);
      }
    });

  app.use('/', router);

  app.listen(3000, function() {
    console.log('Express server listening on port 3000');
  });

  function notFound(params) {
    params.res.status(404).send({
      message: 'Not found'
    });
  }

  function generateUser(params) {
    var user = new User();
    user.uuid = generateUUID();
    user.secret = generateSecret();
    userExists(user.uuid, params, generateUser, save);

    function save(params) {
      user.save(function(err) {
        if (err) {
          params.res.send(err);
        }
        params.res.status(201).json({
          message: 'User generated!',
          uuid: user.uuid,
          secret: user.secret
        });
      });
    }
  }

  function saveRoute(params) {
    var route = new Route();
    route.uuid = params.uuid;
    route.points = params.req.body.points;
    route.save(function(err) {
      if (err) {
        params.res.send(err);
      }
      params.res.status(201).json({
        message: 'Route saved for ' + route.uuid
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

  function generateSecret() {
    return crypto.randomBytes(64).toString('hex');
  }

  function userExists(uuid, params, yes, no) {
    User.find({
      'uuid': uuid
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

  function checkUserInfo(uuid, secret, params, yes, no) {
    User.find({
      'uuid': uuid,
      'secret': secret
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
