module.exports = function(mongoose) {

  var TeamSchema = new mongoose.Schema({
    name: {type: String, required: true},
    category: {type: String, required: true}
  });

  return mongoose.model('Team', TeamSchema);
};
