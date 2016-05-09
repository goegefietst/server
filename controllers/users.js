var User = require('../models/Users');
var crypto = require('crypto');
var Q = require('q');

var UserController = function() {};

UserController.generateUser = function(prevCount) {
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
    UserController.generateUser(count);
  }
};

UserController.checkUserInfo = function(uuid, secret) {
  var promise = User.find({
    'uuid': uuid,
    'secret': secret
  }).exec();
  return promise.then(check);

  function check(docs) {
    var deferred = Q.defer();
    if (docs.length) {
      deferred.resolve(uuid);
    } else {
      deferred.reject('Unauthorized');
    }
    return deferred.promise;
  }
};

// Make sure to check if teams exist and fill them in first and to update routes as well
UserController.updateUserInfo = function(uuid, secret, teams) {
  return User.update({
    'uuid': uuid,
    'secret': secret
  }, {
    $set: {
      'teams': teams
    }
  }).exec();
};

function isNewUser(user) {
  return User.find({
    'uuid': user.uuid
  }).exec().then(check);

  function check(docs) {
    var deferred = Q.defer();
    if (!docs.length) {
      deferred.resolve(user);
    } else {
      deferred.resolve(false);
    }
    return deferred.promise;
  }
}

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

module.exports = UserController;
