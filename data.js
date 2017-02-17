var path = require('path');
var fs = require('fs');
var Q = require('q');

var data = JSON.parse(fs.readFileSync(path.join(__dirname, './data.json'), {
  encoding: 'utf8'
}));

var Data = function(services) {
  Data.CategoryService = services.category;
  Data.TeamService = services.team;
  data.teams = checkForDoubles(data, 'teams');
  data.categories = (checkForDoubles(data, 'categories'));
  Q.allSettled(insertCategories()).then(insertTeams);
};

function insertCategories() {
  return data.categories.map(function(category) {
    return Data.CategoryService.findByName(category.name).then(function() {
      return Data.CategoryService.save(category.name);
    });
  });
}

function insertTeams() {
  return data.teams.map(function(team) {
    return Data.CategoryService.findByName(team.category).then(function() {
      return Data.TeamService.save(team);
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

module.exports = Data;
