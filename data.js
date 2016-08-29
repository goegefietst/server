var path = require('path');
var fs = require('fs');
var Q = require('q');
var CategoryService = require('./services/category.service.js');
var TeamService = require('./services/team.service.js');

var data = JSON.parse(fs.readFileSync(path.join(__dirname, './data.json'), {
  encoding: 'utf8'
}));

function insertCategories() {
  return data.categories.map(function(category) {
    return CategoryService.findByName(category.name).catch(function() {
      return CategoryService.save(category.name);
    });
  });
}

function insertTeams() {
  return data.teams.map(function(team) {
    return CategoryService.findByName(team.category).then(function() {
      return TeamService.save(team);
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
