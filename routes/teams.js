var UserController = require('../controllers/users.js');
var TeamController = require('../controllers/teams.js');
var RouteController = require('../controllers/routes.js');
var CategoryController = require('../controllers/categories.js');
var Q = require('q');

module.exports = function(router, cache) {
  var TEAM_DISTANCES = 'TEAM_DISTANCES';
  var TEAM_NAMES = 'TEAM_NAMES';

  cache.addFunction(getTeamDistances);
  cache.addFunction(getTeamNames);

  function getTeamDistances() {
    return TeamController
      .getDistances(RouteController.aggregate)
      .then(function(teams) {
        return {key: TEAM_DISTANCES, value: teams};
      });
  }

  function getTeamNames() {
    return TeamController
      .getTeams()
      .then(function(teams) {
        return {key: TEAM_NAMES, value: teams};
      });
  }

  router.route('/teams/names').get(function(req, res) {
    var cached = cache.getValue.bind(cache)(TEAM_NAMES);
    if (cached) {
      respond(cached);
    } else {
      TeamController.getTeams().then(respond).catch(error);
    }

    function respond(docs) {
      res.status(200).json(docs);
    }

    function error(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(404).send({
          message: 'Not found'
        });
      }
    }
  });

  router.route('/teams/distances').get(function(req, res) {
    var cached = cache.getValue.bind(cache)(TEAM_DISTANCES);
    if (cached) {
      respond(cached);
    } else {
      TeamController
        .getDistances(RouteController.aggregate).then(respond).catch(error);
    }

    function respond(docs) {
      res.status(200).json(docs);
    }

    function error(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(404).send({
          message: 'Not found'
        });
      }
    }
  });

  router.route('/teams').post(function(req, res) {
    UserController
      .checkUserInfo('admin', req.header('secret')) //FIXME hardcoded, move to config or something
      .then(function() {
        return Q.resolve(req.body.team.category);
      })
      .then(CategoryController.getCategory)
      .then(function() {
        return Q.resolve(req.body.team);
      })
      .then(TeamController.saveTeam)
      .then(respond).catch(error);

    function respond(docs) {
      res.status(200).json(docs);
    }

    function error(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(404).send({
          message: 'Not found'
        });
      }
    }
  });
};
