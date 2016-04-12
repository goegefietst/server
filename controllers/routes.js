var Route = require('../models/Routes');

var RouteController = function() {};

RouteController.saveRoute = function(params) {
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
};

RouteController.getRoutes = function(params) {
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
};

RouteController.notFound = function(params) {
  params.res.status(404).send({
    message: 'Not found'
  });
};

module.exports = RouteController;
