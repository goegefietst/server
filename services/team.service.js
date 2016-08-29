var Team = require('./../models/team.model.js');
var Q = require('q');

var TeamService = function() {
};

TeamService.save = function(team) {
  if (!team || typeof team !== 'object' || !team.category || !team.name) {
    return Q.reject({
      status: 400,
      message: 'Object \'team\' required with String ' +
      'properties  \'name\' and \'category\''
    });
  }
  return TeamService.findByName(team.name)
    .then(alreadyExists)
    .then(save);

  function alreadyExists(teams) {
    if (teams.length > 0) {
      return Q.reject({
        status: 409,
        message: 'A team with that name exists already'
      });
    }
  }

  function save() {
    return Team.create({
      category: team.category,
      name: team.name
    });
  }
};

TeamService.findByName = function(name) {
  if (!name || typeof name !== 'string') {
    return Q.reject({
      status: 400,
      message: 'String \'name\' required to find team by name'
    });
  }
  return Team.find({name: name})
    .select({name: 1, category: 1, _id: 0})
    .limit(1)
    .exec();
};

TeamService.findByCategory = function(name) {
  if (!name || typeof name !== 'string') {
    return Q.reject({
      status: 400,
      message: 'String \'name\' of category required to find team by category'
    });
  }
  return Team.find({$elemMatch: {name: name}})
    .select({name: 1, category: 1, _id: 0})
    .exec();
};

TeamService.findAll = function() {
  return Team.find({})
    .select({name: 1, category: 1, _id: 0})
    .exec();
};

module.exports = TeamService;
