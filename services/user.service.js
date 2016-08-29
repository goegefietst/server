var User = require('../models/user.model.js');
var crypto = require('crypto');
var Q = require('q');

var UserService = function() {
};

UserService.generateUser = function(prevCount) {
  var count = 0;
  var user = new User();
  if (prevCount) {
    count = prevCount;
  }
  user.uuid = generateUUID();
  user.secret = generateSecret();
  return isNewUser(user).then(saveUser).catch(tryAgain);

  function saveUser(user) {
    return user.save();
  }

  function tryAgain() {
    if (++count > 4) {
      console.log('Tried and failed to generate a user five times');
      return;
    }
    UserService.generateUser(count);
  }
};

UserService.checkUserInfo = function(uuid, secret) {
  if (!uuid || typeof uuid !== 'string' || !secret ||
    typeof secret !== 'string') {
    return Q.reject({
      status: 400,
      message: 'String \'uuid\' and String \'secret\' ' +
      'required to check user info'
    });
  }
  return User.find({'uuid': uuid, 'secret': secret})
    .exec()
    .then(check);

  function check(docs) {
    if (docs && docs.length) {
      return uuid;
    } else {
      return Q.reject({
        status: 401,
        message: 'Unauthorized'
      });
    }
  }
};

function isNewUser(user) {
  if (!user || !user.secret) {
    return Q.reject({
      status: 400,
      message: 'Object \'user\' with String property \'secret\' ' +
      'required to check if user is new'
    });
  }
  return User.find({'uuid': user.uuid})
    .exec()
    .then(check);

  function check(docs) {
    if (!docs || docs.length < 1) {
      return user;
    } else {
      return false;
    }
  }
}

function generateUUID() {
  var d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16); // jshint ignore:line
  });
}

function generateSecret() {
  return crypto.randomBytes(64).toString('hex');
}

module.exports = UserService;
