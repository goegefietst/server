var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  uuid: String,
  secret: String
});

module.exports = mongoose.model('User', UserSchema);
