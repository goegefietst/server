var express = require('express');
var program = require('commander');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');
var fs = require('fs');
mongoose.Promise = require('q').Promise;
var Q = require('q');

var CategoryController = require('./controllers/categories.js');
var TeamController = require('./controllers/teams.js');

program
  .option('-c --config [config]', 'specify config file')
  .parse(process.argv);

var configFile = program.config ||
  path.join(__dirname, './config-example.json');
var config = JSON.parse(fs.readFileSync(configFile, {
  encoding: 'utf8'
}));

var port = config.port;
var login = config.source.login ?
  config.source.login + ':' + config.source.password + '@' : '';

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(logger('dev'));

var router = express.Router();

router.use(function(req, res, next) {
  next();
});

require('./routes/routes.js')(router);
require('./routes/users.js')(router);

app.use(express.static(__dirname + '/public'));

router.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

router.get('/policy', function(req, res) {
  res.sendFile(__dirname + '/public/policy.html');
});

mongoose.connect(config.source.type + '://' + login + config.source.host +
  ':' + config.source.port + '/' + config.source.db);

app.use('/', router);

var data = JSON.parse(fs.readFileSync(path.join(__dirname, './data.json'), {
  encoding: 'utf8'
}));

function insertCategories() {
  return data.categories.map(function(category) {
    return CategoryController.getCategory(category.name).then(function(result) {
      if (result.length === 0) {
        return CategoryController.saveCategory(category.name);
      } else {
        return Q.reject();
      }
    });
  });
}

function insertTeams() {
  return data.teams.map(function(team) {
    return TeamController.getTeam(team.name).then(function(result) {
      if (result.length === 0) {
        return TeamController.saveTeam(team);
      } else {
        return Q.reject();
      }
    });
  });
}

Q.all(insertCategories()).then(insertTeams);

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
