var Q = require('q');

var TeamController = function(router, services, admin) {
  var TEAMS = 'TEAMS';
  var cache = services.cache;
  var categoryService = services.category;
  var teamService = services.team;
  var routeService = services.route;

  cache.addFunction(TEAMS, getTeams);

  router.route('/teams').get(function(req, res) {
    var cached = cache.getValue.call(cache, TEAMS);
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
    if (!req.body) {
      error({
        status: 400,
        message: 'No body'
      });
    }
    teamService.validate(req.body)
      .then(function(team) {
        return categoryService.findByName(team.category)
          .then(function(categories) {
            if (categories.length > 0) {
              return team;
            } else {
              return Q.reject({
                status: 400,
                message: 'No category with that name'
              });
            }
          });
      })
      .then(teamService.save.bind(teamService))
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

  function getTeams() {
    return teamService.findAll().then(addDistances);
    function addDistances(teams) {
      if (teams.length < 1) {
        return teams;
      }
      var promises = [];
      for (var i = 0; i < teams.length; i++) {
        promises.push(routeService.addDistanceToTeam(teams[i].toObject()));
      }
      return Q.all(promises);
    }
  }
};

module.exports = TeamController;
