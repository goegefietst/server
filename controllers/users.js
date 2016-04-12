var User = require('../models/Users');
var crypto = require('crypto');

var UserController = function() {};

UserController.generateUser = function(params) {
  var user = new User();
  user.uuid = generateUUID();
  user.secret = generateSecret();
  userExists(user.uuid, params, UserController.generateUser, save);

  function save(params) {
    user.save(function(err) {
      if (err) {
        params.res.send(err);
      }
      params.res.status(201).json({
        message: 'User generated!',
        uuid: user.uuid,
        secret: user.secret
      });
    });
  }
};

UserController.checkUserInfo = function(uuid, secret, params, yes, no) {
  User.find({
    'uuid': uuid,
    'secret': secret
  }, check);

  function check(err, docs) {
    if (err) {
      console.log(err);
    }
    if (docs.length) {
      yes(params);
    } else {
      no(params);
    }
  }
};

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16); // jshint ignore:line
  });
  return uuid;
}

function generateSecret() {
  return crypto.randomBytes(64).toString('hex');
}

function userExists(uuid, params, yes, no) {
  User.find({
    'uuid': uuid
  }, check);

  function check(err, docs) {
    if (err) {
      console.log(err);
    }
    if (docs.length) {
      yes(params);
    } else {
      no(params);
    }
  }
}

module.exports = UserController;
