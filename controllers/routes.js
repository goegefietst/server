var Route = require('../models/Routes');
var UserController = require('./users.js');
var q = require('q');

var RouteController = function() {};

RouteController.saveRoute = function(values) {
  return UserController.checkUserInfo(values.uuid, values.secret)
    .then(function(users) {
      if (users.length === 1) {
        var route = new Route();
        route.uuid = values.uuid;
        route.points = values.points;
        route.distance = values.distance;
        route.time = values.time;
        route.teams = users[0].teams;
        return route.save();
      } else {
        return q.reject('Could not find given user');
      }
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
