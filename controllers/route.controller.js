var RouteController = function(router, services) {
  var routeService = services.route;
  var userService = services.user;

  router.route('/routes').post(function(req, res) {
    if (!req.body) {
      error({
        status: 400,
        message: 'No body'
      });
    }
    routeService.validate(req.body)
      .then(function(route) {
        return userService.checkUserInfo(route.uuid, req.header('secret'))
          .then(function() {
            return route;
          });
      })
      .then(routeService.save.bind(routeService))
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

  router.route('/routes/:uuid.json').get(function(req, res) {
    var uuid = req.params.uuid;
    var secret = req.header('secret');
    userService.checkUserInfo(uuid, secret)
      .then(routeService.findByUserId.bind(routeService))
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
