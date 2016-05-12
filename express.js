var express = require('express');
var program = require('commander');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');
var fs = require('fs');
mongoose.Promise = require('q').Promise;

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
require('./routes/teams.js')(router);

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

require('./data.js')();

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
