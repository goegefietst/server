var Q = require('q');
var CategoryService = require('../services/category.service.js');
var TeamService = require('../services/team.service.js');
var RouteService = require('../services/route.service.js');

var TeamController = function(router, cache, admin) {
  var TEAMS = 'TEAMS';

  cache.addFunction(TEAMS, getTeams);

  // fixme changed from /teams/distances to /teams
  router.route('/teams').get(function(req, res) {
    var cached = cache.getValue.bind(cache)(TEAMS);
    if (cached) {
      respond(cached);
    } else {
      getTeams().then(respond).catch(error);
    }

    function respond(teams) {
      res.status(200).json(teams);
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

  router.route('/teams').post(function(req, res) {
    if (admin.login !== req.header('login') ||
      admin.password !== req.header('password')) {
      error({
        status: 401,
        message: 'Unauthorized'
      });
    }
    if (!req.body || !req.body.team || !req.body.team.category) {
      error();
    }
    CategoryService.findByName(req.body.team.category)
      .then(function() {
        return req.body.team;
      })
      .then(TeamService.save)
      .then(respond).catch(error);

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
};

function getTeams() {
  return TeamService.findAll().then(addDistances);
  function addDistances(teams) {
    if (teams.length < 1) {
      return teams;
    }
    var promises = [];
    for (var i = 0; i < teams.length; i++) {
      promises.push(RouteService.addDistanceToTeam(teams[i].toObject()));
    }
    return Q.all(promises);
  }
}

module.exports = TeamController;
