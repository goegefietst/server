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
  path.join(__dirname, './config.json');
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
mongoose.connect(config.source.type + '://' + login + config.source.host +
  ':' + config.source.port + '/' + config.source.db);

var router = express.Router();
router.use(function(req, res, next) {
  next();
});
var interval = config.cache ? config.cache * 60 * 1000 : 5 * 60 * 1000;
var models = {
  category: require('./models/category.model')(mongoose),
  route: require('./models/route.model')(mongoose),
  team: require('./models/team.model')(mongoose),
  user: require('./models/user.model')(mongoose),
  util: require('./models/model.util')
};
var services = {
  cache: new (require('./cache.js'))(interval),
  category: new (require('./services/category.service'))(models.category, models.util),
  route: new (require('./services/route.service'))(models.route, models.util),
  team: new (require('./services/team.service'))(models.team, models.util),
  user: new (require('./services/user.service.js'))(models.user, models.util)
};
require('./controllers/route.controller.js')(router, services);
require('./controllers/user.controller.js')(router, services);
require('./controllers/team.controller.js')(router, services, config.admin);
require('./data.js')(services);

app.use(express.static(__dirname + '/public'));

router.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

router.get('/policy', function(req, res) {
  res.sendFile(__dirname + '/public/policy.html');
});

app.use('/', router);

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
