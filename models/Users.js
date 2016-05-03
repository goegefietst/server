var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  uuid: String,
  secret: String,
  teams: [{name: String, category: String}]
});

module.exports = mongoose.model('User', UserSchema);
