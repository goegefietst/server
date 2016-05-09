var Route = require('../models/Routes');

var RouteController = function() {};

// Make sure to check if uuid and secret are correct and teams are filled in correctly
RouteController.saveRoute = function(values) {
  var route = new Route();
  route.uuid = values.uuid;
  route.points = values.points;
  route.distance = values.distance;
  route.time = values.time;
  route.teams = values.teams;
  return route.save();
};

// Make sure to check if uuid and secret are correct and teams are filled in correctly
RouteController.updateRoutes = function(uuid, teams) {
  return Route.update({
    'uuid': uuid
  }, {
    $set: {
      'teams': teams
    }
  }, {
    multi: true
  });
};

RouteController.getRoutes = function(uuid) {
  if (uuid) {
    return Route.find({
      'uuid': uuid
    }).select({
      points: 1,
      _id: 0
    }).exec();
  } else {
    return Route.find({}).select({
      points: 1,
      _id: 0
    }).exec();
  }
};

module.exports = RouteController;
