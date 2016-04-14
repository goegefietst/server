var Route = require('../models/Routes');

var RouteController = function() {};

RouteController.saveRoute = function(values) {
  var route = new Route();
  route.uuid = values.uuid;
  route.points = values.points;
  return route.save();
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
