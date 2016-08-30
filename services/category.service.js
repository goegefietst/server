var Q = require('q');

var CategoryService = function(model, util) {
  this.model = model;
  this.util = util;
};

CategoryService.prototype.save = function(name) {
  if (!name || typeof name !== 'string') {
    return Q.reject({
      status: 400,
      message: 'String \'name\' required to save category'
    });
  }
  return this.findByName(name)
    .then(alreadyExists)
    .then(save.bind(this));

  function alreadyExists(categories) {
    if (categories.length > 0) {
      return Q.reject({
        status: 409,
        message: 'A category with that name exists already'
      });
    }
  }

  function save() {
    return this.model.create({name: name});
  }
};

CategoryService.prototype.findAll = function() {
  return this.model.find({})
    .select({name: 1, _id: 0})
    .exec();
};

CategoryService.prototype.findByName = function(name) {
  if (!name || typeof name !== 'string') {
    return Q.reject({
      status: 400,
      message: 'String \'name\' required to find category by name'
    });
  }
  return this.model.find({name: name})
    .select({name: 1, _id: 0})
    .limit(1)
    .exec();
};

CategoryService.prototype.validate = function(category) {
  var doc = this.model(category);
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

module.exports = CategoryService;
