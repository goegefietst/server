var RouteService = require('../services/route.service.js');
var UserService = require('../services/user.service.js');

var RouteController = function(router) {

  // fixme changed from /route/:uuid to /routes
  router.route('/routes').post(function(req, res) {
    var route = {
      uuid: req.body.uuid, //fixme changed from params to body
      secret: req.header('secret'),
      points: req.body.points,
      distance: req.body.distance,
      time: req.body.time,
      teams: req.body.teams
    };
    UserService.checkUserInfo(req.body.uuid, req.header('secret'))
      .then(function() {
        return route;
      })
      .then(RouteService.save)
      .then(respond)
      .catch(error);

    function respond(route) {
      res.status(201).json({
        message: 'Route saved for ' + route.uuid
      });
    }

    function error(err) {
      if (err && err.status && err.message) {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send({
          message: 'Internal server error'
        });
      }
    }
  });

  // fixme changed from /route/:uuid.json to /routes/:uuid.json
  router.route('/routes/:uuid.json').get(function(req, res) {
    var uuid = req.params.uuid;
    var secret = req.header('secret');
    UserService.checkUserInfo(uuid, secret)
      .then(RouteService.findByUserId)
      .then(respond)
      .catch(error);

    function respond(docs) {
      res.status(200).json(docs);
    }

    function error(err) {
      if (err && err.status && err.message) {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send({
          message: 'Internal server error'
        });
      }
    }
  });

  router.route('/routes/:uuid').get(function(req, res) {
    res.status(303).redirect('/routes/' + req.params.uuid + '.json');
  });

};

module.exports = RouteController;
