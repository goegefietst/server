(function() {
  'use strict';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var UserSchema = new Schema({
    guid: String
  });

  module.exports = mongoose.model('User', UserSchema);
})();
