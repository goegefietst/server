var Category = require('../models/Categories');
var Q = require('q');

var CategoryController = function() {};

CategoryController.saveCategory = function(name) {
  return CategoryController.getCategory(name).then(function(categories) {
    if (categories.length === 0) {
      var category = new Category();
      category.name = name;
      return category.save();
    } else {
      return Q.reject('A category with that name exists already');
    }
  });
};

CategoryController.getCategories = function() {
  return Category.find({}).select({
    name: 1,
    _id: 0
  }).exec();
};

CategoryController.getCategory = function(name) {
  return Category.find({
    name: name
  }).limit(1).exec();
};

module.exports = CategoryController;
