var Q = require('q');

var TeamService = function(model, util) {
  this.model = model;
  this.util = util;
};

TeamService.prototype.save = function(team) {
  if (!team || typeof team !== 'object' || !team.category || !team.name) {
    return Q.reject({
      status: 400,
      message: 'Object \'team\' required with String ' +
      'properties  \'name\' and \'category\''
    });
  }
  return this.findByName(team.name)
    .then(alreadyExists)
    .then(save.bind(this));

  function alreadyExists(teams) {
    if (teams.length > 0) {
      return Q.reject({
        status: 409,
        message: 'A team with that name exists already'
      });
    }
  }

  function save() {
    return this.model.create({
      category: team.category,
      name: team.name
    });
  }
};

TeamService.prototype.findByName = function(name) {
  if (!name || typeof name !== 'string') {
    return Q.reject({
      status: 400,
      message: 'String \'name\' required to find team by name'
    });
  }
  return this.model.find({name: name})
    .select({name: 1, category: 1, _id: 0})
    .limit(1)
    .exec();
};

TeamService.prototype.findByCategory = function(name) {
  if (!name || typeof name !== 'string') {
    return Q.reject({
      status: 400,
      message: 'String \'name\' of category required to find team by category'
    });
  }
  return this.model.find({$elemMatch: {name: name}})
    .select({name: 1, category: 1, _id: 0})
    .exec();
};

TeamService.prototype.findAll = function() {
  return this.model.find({})
    .select({name: 1, category: 1, _id: 0})
    .exec();
};

TeamService.prototype.validate = function(team) {
  var doc = this.model(team);
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

module.exports = TeamService;
