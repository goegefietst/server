var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PointSchema = new Schema({
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

var RouteSchema = new Schema({
  uuid: String,
  points: [PointSchema],
  distance: Number,
  time: Number,
  teams: [{name: String, category: String}]
});

module.exports = mongoose.model('Route', RouteSchema);
