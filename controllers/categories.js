var Category = require('../models/Categories');
var Q = require('q');

var CategoryController = function() {};

CategoryController.saveCategory = function(name) {
  return CategoryController.getCategory(name).then(function() {
    return Q.reject('A category with that name exists already');
  }).catch(function() {
    var category = new Category();
    category.name = name;
    return category.save();
  });
};

CategoryController.getCategories = function() {
  return Category.find({}).exec().then(function(categories) {
    if (categories.length > 0) {
      return Q.resolve(categories);
    } else {
      return Q.reject('Could not find any categories');
    }
  });
};

CategoryController.getCategory = function(name) {
  return Category.find({
    name: name
  }).limit(1).exec().then(function(categories) {
    if (categories.length > 0) {
      return Q.resolve(categories[0]);
    } else {
      return Q.reject('Could not find category with that name');
    }
  });
};

module.exports = CategoryController;
