var Q = require('q');

var RouteService = function(model, util) {
  this.model = model;
  this.util = util;
};

RouteService.prototype.save = function(route) {
  if (!route || !route.uuid || !route.points || !route.teams) {
    return Q.reject({
      status: 400,
      message: 'Object \'route\' required with properties ' +
      '\'uuid\', \'points\' and \'teams\''
    });
  }
  return this.model.create({
    uuid: route.uuid,
    points: route.points,
    time: route.time,
    teams: route.teams,
    distance: distancePoints(route.points)
  });
};

RouteService.prototype.findByUserId = function(uuid) {
  if (!uuid) {
    return Q.reject({
      status: 400,
      message: 'String \'uuid\' required to find route by user'
    });
  }
  return this.model.find({'uuid': uuid})
    .select({uuid: 1, points: 1, distance: 1, time: 1, teams: 1, _id: 0})
    .exec();
};

RouteService.prototype.findByTeam = function(team) {
  if (!team || !team.name) {
    return Q.reject({
      status: 400,
      message: 'Object \'team\' with property \'name\' required' +
      ' to find route by team'
    });
  }
  return this.model.find({$match: {teams: {$elemMatch: {name: team.name}}}})
    .select({uuid: 1, points: 1, distance: 1, time: 1, teams: 1, _id: 0})
    .exec();
};

RouteService.prototype.addDistanceToTeam = function(team, time) {
  if (!team || !team.name) {
    return Q.reject({
      status: 400,
      message: 'Object \'team\' with property \'name\' required' +
      ' to add distance to team'
    });
  }
  var deferred = Q.defer();
  var pipelineNoTime = [
    {
      $match: {
        teams: {$elemMatch: {name: team.name}},

      }
    },
    {$group: {_id: '', distance: {$sum: '$distance'}}},
    {$project: {_id: 0, distance: '$distance'}}
  ];
  var pipelineWithTime = [
    {
      $match: {
        teams: {$elemMatch: {name: team.name}},
        points: {$elemMatch: {time: {'$gte': time}}}
      }
    },
    {$group: {_id: '', distance: {$sum: '$distance'}}},
    {$project: {_id: 0, distance: '$distance'}}
  ];
  var wrap = function(err, res) {
    if (err) {
      deferred.reject(err);
    }
    if (res && res[0]) {
      team.time = 1;
      team.distance = res[0].distance;
      deferred.resolve(team);
    } else {
      team.distance = 0;
      deferred.resolve(team);
    }
  };
  if (time) {
    this.model.aggregate(pipelineWithTime, wrap);
  } else {
    this.model.aggregate(pipelineNoTime, wrap);
  }
  return deferred.promise;
};

RouteService.prototype.validate = function(route) {
  var doc = this.model(route);
  var deferred = Q.defer();
  doc.validate(function(err) {
    if (!err) {
      deferred.resolve(doc.toObject());
    } else {
      deferred.reject({
        status: 400,
        message: 'Incorrect body, correct schema is: \n' +
        JSON.stringify(this.util.objectify(doc), null, 2)
      });
    }
  }.bind(this));
  return deferred.promise;
};

function distancePoints(points) {
  if (points.length < 2) {
    return 0;
  }
  points.sort(function(a, b) {
    return a.time - b.time;
  });
  var distance = 0;
  for (var i = 0; i < points.length - 1; i++) {
    var first = points[i];
    var second = points[i + 1];
    distance += distanceLatLng(
      first.latitude, first.longitude,
      second.latitude, second.longitude
    );
  }
  return distance;
}

function distanceLatLng(lat1, lon1, lat2, lon2) {
  var radlat1 = Math.PI * lat1 / 180;
  var radlat2 = Math.PI * lat2 / 180;
  var theta = lon1 - lon2;
  var radtheta = Math.PI * theta / 180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;
  return dist;
}

module.exports = RouteService;
