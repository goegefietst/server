(function() {
  'use strict';
  var express = require('express');
  var program = require('commander');
  var path = require('path');
  var mongoose = require('mongoose');
  var bodyParser = require('body-parser');
  var logger = require('morgan');
  var crypto = require('crypto');
  var fs = require('fs');

  var Route = require('./models/Routes');
  var User = require('./models/Users');

  program
    .option('-c --config [config]', 'specify config file')
    .parse(process.argv);

  var configFile = program.config || path.join(__dirname, './config-example.json');
  var config = JSON.parse(fs.readFileSync(configFile, {
    encoding: 'utf8'
  }));

  var port = config.port;
  var login = config.source.login ?
    config.source.login + ':' + config.source.password + '@' : '';

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

  mongoose.connect(config.source.type + '://' + login + config.source.host +
    ':' + config.source.port + '/' + config.source.db);

  router.route('/user/:uuid').post(function(req, res) {
    var params = {};
    params.res = res;
    params.req = req;
    params.uuid = req.params.uuid;
    checkUserInfo(params.uuid, req.body.secret, params, saveRoute, notFound);
  });

  router.route('/user').post(function(req, res) {
    if (req.body.uuid) {
      //TODO
    } else {
      var params = {};
      params.res = res;
      generateUser(params);
    }
  });

  router.route('/user/:uuid.json').get(function(req, res) {
    var params = {};
    params.res = res;
    params.req = req;
    params.uuid = req.params.uuid;
    params.secret = req.header('secret');
    checkUserInfo(params.uuid, params.secret, params, getRoutes, notFound);
  });

  router.route('/user/:uuid').get(function(req, res) {
    res.status(303).redirect('/user/' + req.params.uuid + '.json');
  });

  router.route('/routes').get(function(req, res) {
    var params = {};
    params.res = res;
    params.req = req;
    getRoutes(params);
  });

  app.use('/', router);

  app.listen(port, function() {
    console.log('Express server listening on port ' + port);
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

  function getRoutes(params) {
    if (params.uuid) {
      Route.find({
        'uuid': params.uuid
      }).select({
        points: 1,
        _id: 0
      }).exec(results);
    } else {
      Route.find({}).select({
        points: 1,
        _id: 0
      }).exec(results);
    }

    function results(err, docs) {
      if (err) {
        console.log(err);
      }
      if (docs.length) {
        params.res.status(200).json(docs);
      } else {
        params.res.status(404).send({
          message: 'Not found'
        });
      }
    }
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
