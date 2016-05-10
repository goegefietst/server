var Team = require('../models/Teams');
var Q = require('q');

var TeamController = function() {};

// Make sure to check if category exists first
TeamController.saveTeam = function(values) {
  if (values && values.category && values.name) {
    return TeamController.getTeam(values.name).then(function() {
      return Q.reject('A team with that name exists already');
    }).catch(function() {
      var team = new Team();
      team.category = values.category;
      team.name = values.name;
      return team.save();
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
  }).exec().then(function(teams) {
    if (teams.length > 0) {
      return Q.resolve(teams);
    } else {
      return Q.reject('Could not find any teams');
    }
  });
};

TeamController.getTeamsByCategory = function(category) {
  if (!category) {
    return Q.reject('Did not give category');
  }
  return Team.find({}).select({
    name: 1,
    category: 1,
    _id: 0
  }).exec().then(function(docs) {
    return docs.filter(function(doc) {
      return doc.category.name === category;
    });
  }).then(function(teams) {
    if (teams.length > 0) {
      return Q.resolve(teams);
    } else {
      return Q.reject('Could not find teams with that category');
    }
  });
};

TeamController.getTeam = function(name, category) {
  if (!name) {
    return Q.reject('Did not give name');
  }
  var fields = {
    name: name
  };
  if (category) {
    fields.category = category;
  }
  return Team.find(fields).select({
    name: 1,
    category: 1,
    _id: 0
  }).limit(1).exec().then(function(teams) {
    if (teams.length > 0) {
      return Q.resolve(teams[0]);
    } else {
      return category ?
        Q.reject('Could not find team with that name and category') :
        Q.reject('Could not find team with that name');
    }
  });
};

TeamController.filterExistingTeams = function(teams) {
  return Q.allSettled(teams.map(teamExists)).then(function(array) {
    return array.filter(function(promise) {
      return promise.state === 'fulfilled';
    });
  }).then(function(promises) {
    return promises.map(function(promise) {
      return promise.value;
    });
  });

  function teamExists(team) {
    return TeamController.getTeam(team.name);
  }
};

TeamController.getDistances = function(aggregate) {
  return Team.find().then(function(teams) {
    return Q.allSettled(teams.map(aggregate)).then(function(array) {
      return array.filter(function(promise) {
        return promise.state === 'fulfilled';
      });
    }).then(function(promises) {
      return promises.map(function(promise) {
        return promise.value;
      });
    });
  });
};

module.exports = TeamController;
