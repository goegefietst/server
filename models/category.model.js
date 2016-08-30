module.exports = function(mongoose) {

  var CategorySchema = mongoose.Schema({
    name: {type: String, required: true}
  });

  return mongoose.model('Category', CategorySchema);
};
