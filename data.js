var path = require('path');
var fs = require('fs');
var Q = require('q');
var CategoryController = require('./controllers/categories.js');
var TeamController = require('./controllers/teams.js');

var data = JSON.parse(fs.readFileSync(path.join(__dirname, './data.json'), {
  encoding: 'utf8'
}));

function insertCategories() {
  return data.categories.map(function(category) {
    return CategoryController.getCategory(category.name).catch(function() {
      return CategoryController.saveCategory(category.name);
    });
  });
}

function insertTeams() {
  return data.teams.map(function(team) {
    return CategoryController.getCategory(team.category).then(function() {
      return TeamController.getTeam(team.name).then(function() {
        //console.log('Team \"' + team.name + '\" exists already');
      }).catch(function() {
        return TeamController.saveTeam(team);
      });
    }).catch(function() {
      console.log('Cannot add team \"' + team.name +
        '\" because its category \"' + team.category + '\" does not exist');
    });
  });
}

function checkForDoubles(data, array) {
  var doubles = [];
  return data[array].filter(function(entry) {
    if (doubles[entry.name]) {
      console.log('Entry \"' + entry.name +
        '\" is multiple times in ' + array);
      return false;
    }
    doubles[entry.name] = true;
    return true;
  });
}

function Data() {
  data.teams = checkForDoubles(data, 'teams');
  data.categories = (checkForDoubles(data, 'categories'));
  Q.allSettled(insertCategories()).then(insertTeams);
}

module.exports = Data;
