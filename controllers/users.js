var User = require('../models/Users');
var crypto = require('crypto');
var Q = require('q');
var TeamController = require('./teams.js');

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

UserController.updateUserInfo = function(uuid, secret, teams) {
  return Q.allSettled(teams.map(teamExists)).then(function(array) {
    //console.log(array);
    return array.filter(function(promise) {
      //console.log(promise);
      return promise.state === 'fulfilled';
    });
  }).then(function(promises) {
    //console.log(promises); // []
    var teams = promises.map(function(promise) {
      return promise.value;
    });
    return User.update({
      'uuid': uuid,
      'secret': secret
    }, {
      'teams': teams
    }).exec();
  });

  function teamExists(team) {
    return TeamController.getTeam(team.name).then(function(teams) {
      if (teams.length === 1) {
        return Q.resolve(team);
      } else {
        return Q.reject('There is no team with that name');
      }
    });
  }
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
