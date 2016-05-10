var TeamController = require('../controllers/teams.js');
var RouteController = require('../controllers/routes.js');

module.exports = function(router) {
  router.route('/teams/names').get(function(req, res) {
    TeamController.getTeams().then(respond).catch(error);

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
    TeamController
      .getDistances(RouteController.aggregate).then(respond).catch(error);

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
