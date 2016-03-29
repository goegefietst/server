(function() {
  'use strict';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var RouteSchema = new Schema({
    userId: String,
    points: [{
      accuracy: Number,
      altitude: Number,
      bearing: Number,
      speed: Number,
      time: Number,
      latitude: Number,
      longitude: Number
    }]
  });

  module.exports = mongoose.model('Route', RouteSchema);
})();
