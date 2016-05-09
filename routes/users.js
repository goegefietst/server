var UserController = require('../controllers/users.js');
var TeamController = require('../controllers/teams.js');
var RouteController = require('../controllers/routes.js');
var Q = require('q');

module.exports = function(router) {

  router.route('/user').post(function(req, res) {
    if (req.body.uuid) {
      //TODO
    } else {
      console.log('Trying to generate user');
      UserController.generateUser().then(respond).catch(error);
    }

    function respond(user) {
      return res.status(201).json({
        message: 'User generated!',
        uuid: user.uuid,
        secret: user.secret
      });
    }

    function error() {
      res.status(500).send({
        message: 'Failed to create a new user.'
      });
    }
  });

  router.route('/user/:uuid').post(function(req, res) {
    var values = {
      uuid: req.params.uuid,
      secret: req.header('secret'),
      teams: req.body.teams
    };
    var checkUserInfo =
      UserController.checkUserInfo(values.uuid, values.secret);
    var filterTeams =
      TeamController.filterExistingTeams(values.teams);
    Q.all([checkUserInfo, filterTeams]).then(function(all) {
      var updateUserInfo =
        UserController.updateUserInfo(values.uuid, values.secret, all[1]);
      var updateRoutes =
        RouteController.updateRoutes(values.uuid, all[1]);
      return Q.all([updateUserInfo, updateRoutes]);
    }).then(respond).catch(error);

    function respond() {
      res.status(200).json({
        message: 'User info updated for ' + values.uuid
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
};
