var Route = require('../models/Routes');
var Q = require('q');

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

RouteController.aggregate = function aggregate(team) {
  var deferred = Q.defer();
  Route.aggregate([{
    $match: {
      teams: {
        $elemMatch: {
          name: team.name
        }
      }
    }
  }, {
    $group: {
      _id: '',
      distance: {
        $sum: '$distance'
      }
    }
  }, {
    $project: {
      _id: 0,
      distance: '$distance'
    }
  }], function(err, res) {
    var values = {
      distance: 0
    };
    if (res && res[0]) {
      values = res[0];
    }
    var result = {
      name: team.name,
      category: team.category,
      values: values
    };
    deferred.resolve(result);
  });
  return deferred.promise;
};

module.exports = RouteController;
