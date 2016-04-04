(function() {
  'use strict';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var PointSchema = Schema({
    accuracy: Number,
    altitude: Number,
    bearing: Number,
    speed: Number,
    time: Number,
    latitude: Number,
    longitude: Number
  }, {
    _id: false
  });

  var RouteSchema = Schema({
    uuid: String,
    points: [PointSchema]
  });

  module.exports = mongoose.model('Route', RouteSchema);
})();
