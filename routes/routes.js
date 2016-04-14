var RouteController = require('../controllers/routes.js');
var UserController = require('../controllers/users.js');
var q = require('q');

module.exports = function(router) {
  router.route('/routes').get(function(req, res) {
    RouteController.getRoutes().then(respond).catch(error);

    function respond(docs) {
      if (docs.length) {
        res.status(200).json(docs);
      } else {
        res.status(404).send({
          message: 'Not found'
        });
      }
    }

    function error(err) {
      if (err) {
        res.send(err);
      } else {
        res.status(404).send({
          message: 'Not found'
        });
      }
    }
  });

  router.route('/route/:uuid').post(function(req, res) {
    var uuid = req.params.uuid;
    var secret = req.header('secret');
    UserController.checkUserInfo(uuid, secret)
      .then(insertRoute)
      .then(RouteController.saveRoute)
      .then(respond)
      .catch(error);

    function insertRoute() {
      var deferred = q.defer();
      deferred.resolve({
        uuid: uuid,
        points: req.body.points
      });
      return deferred.promise;
    }

    function respond(route) {
      res.status(201).json({
        message: 'Route saved for ' + route.uuid
      });
    }

    function error(err) {
      if (err) {
        res.status(401).send({
          message: err
        });
      } else {
        res.status(404).send({
          message: 'Not found'
        });
      }
    }
  });

  router.route('/route/:uuid.json').get(function(req, res) {
    var uuid = req.params.uuid;
    var secret = req.header('secret');
    UserController.checkUserInfo(uuid, secret)
      .then(RouteController.getRoutes)
      .then(respond)
      .catch(error);

    function respond(docs) {
      res.status(200).json(docs);
    }

    function error(err) {
      if (err) {
        res.status(401).send({
          message: err
        });
      } else {
        res.status(404).send({
          message: 'Not found'
        });
      }
    }
  });

  router.route('/route/:uuid').get(function(req, res) {
    res.status(303).redirect('/route/' + req.params.uuid + '.json');
  });

};
