var Team = require('../models/Teams');
var CategoryController = require('./categories.js');
var Q = require('q');

var TeamController = function() {};

TeamController.saveTeam = function(values) {
  if (values && values.category && values.name) {
    var categoryExists = CategoryController.getCategory(values.category)
      .then(function(categories) {
        if (categories.length === 1) {
          return Q.resolve(values.category);
        } else {
          return Q.reject('Could not find given category');
        }
      });
    var isNewTeam = TeamController.getTeam(values.name)
      .then(function(teams) {
        if (teams.length === 0) {
          return Q.resolve(values.name);
        } else {
          return Q.reject('A team with that name exists already');
        }
      });
    return Q.all([categoryExists, isNewTeam]).then(function(values) {
      var team = new Team();
      team.category = values[0];
      team.name = values[1];
      team.save();
    });
  } else {
    return Q.reject('Did not enter category or name');
  }
};

TeamController.getTeams = function() {
  return Team.find({}).select({
    name: 1,
    category: 1,
    _id: 0
  }).populate('category').exec();
};

TeamController.getTeamsByCategory = function(category) {
  return Team.find({}).select({
    name: 1,
    category: 1,
    _id: 0
  }).populate('category').exec().then(function(docs) {
    return docs.filter(function(doc) {
      return doc.category.name === category;
    });
  });
};

TeamController.getTeam = function(name) {
  return Team.find({
    name: name
  }).limit(1).exec();
};

module.exports = TeamController;
