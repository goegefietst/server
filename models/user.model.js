module.exports = function(mongoose) {

  var UserSchema = new mongoose.Schema({
    uuid: {type: String, required: true},
    secret: {type: String, required: true}
  });

  return mongoose.model('User', UserSchema);
};
