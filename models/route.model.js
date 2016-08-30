module.exports = function(mongoose) {

  var PointSchema = new mongoose.Schema({
    accuracy: {type: Number, required: false},
    altitude: {type: Number, required: false},
    bearing: {type: Number, required: false},
    speed: {type: Number, required: false},
    time: {type: Number, required: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true}
  }, {
    _id: false
  });

  var TeamSchema = new mongoose.Schema({
    name: {type: String, required: true},
    category: {type: String, required: true}
  });

  var RouteSchema = new mongoose.Schema({
    uuid: {type: String, required: true},
    points: {type: [PointSchema], required: false}, //require array means at least 1 elem in it needed
    distance: {type: Number, required: false},
    time: {type: Number, required: false},
    teams: {type: [TeamSchema], required: false} //default behaviour makes empty array if not present
  });

  return mongoose.model('Route', RouteSchema);
};
