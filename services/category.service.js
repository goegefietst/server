var Category = require('../models/category.model.js');
var Q = require('q');

var CategoryService = function() {
};

CategoryService.save = function(name) {
  if (!name || typeof name !== 'string') {
    return Q.reject({
      status: 400,
      message: 'String \'name\' required to save category'
    });
  }
  return CategoryService.findByName(name)
    .then(alreadyExists)
    .then(save);

  function alreadyExists(categories) {
    if (categories.length > 0) {
      return Q.reject({
        status: 409,
        message: 'A category with that name exists already'
      });
    }
  }

  function save() {
    var category = new Category();
    category.name = name;
    return category.save();
  }
};

CategoryService.findAll = function() {
  return Category.find({})
    .select({name: 1, _id: 0})
    .exec();
};

CategoryService.findByName = function(name) {
  if (!name || typeof name !== 'string') {
    return Q.reject({
      status: 400,
      message: 'String \'name\' required to find category by name'
    });
  }
  return Category.find({name: name})
    .select({name: 1, _id: 0})
    .limit(1)
    .exec();
};

module.exports = CategoryService;
