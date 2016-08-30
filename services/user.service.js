var crypto = require('crypto');
var Q = require('q');

var UserService = function(model, util) {
  this.model = model;
  this.util = util;
};

UserService.prototype.generateUser = function(prevCount) {
  var count = 0;
  if (prevCount) {
    count = prevCount;
  }
  var user = {
    uuid: generateUUID(),
    secret: generateSecret()
  };
  return this.isNewUser(user)
    .then(saveUser.bind(this))
    .catch(tryAgain.bind(this));

  function saveUser(user) {
    return this.model.create(user);
  }

  function tryAgain() {
    if (++count > 4) {
      console.log('Tried and failed to generate a user five times');
      return;
    }
    this.generateUser(count);
  }
};

UserService.prototype.checkUserInfo = function(uuid, secret) {
  if (!uuid || typeof uuid !== 'string' || !secret ||
    typeof secret !== 'string') {
    return Q.reject({
      status: 400,
      message: 'String \'uuid\' and String \'secret\' ' +
      'required to check user info'
    });
  }
  return this.model.find({'uuid': uuid, 'secret': secret})
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

UserService.prototype.isNewUser = function(user) {
  if (!user || !user.secret) {
    return Q.reject({
      status: 400,
      message: 'Object \'user\' with String property \'secret\' ' +
      'required to check if user is new'
    });
  }
  return this.model.find({'uuid': user.uuid})
    .exec()
    .then(check);

  function check(docs) {
    if (!docs || docs.length < 1) {
      return user;
    } else {
      return false;
    }
  }
};

UserService.prototype.validate = function(user) {
  var doc = this.model(user);
  var deferred = Q.defer();
  doc.validate(function(err) {
    if (!err) {
      deferred.resolve(doc.toObject());
    } else {
      deferred.reject({
        status: 400,
        message: 'Incorrect body, correct schema is: \n' +
        JSON.stringify(this.util.objectify(doc), null, 2)
      });
    }
  }.bind(this));
  return deferred.promise;
};

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
