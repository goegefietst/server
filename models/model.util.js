module.exports = {
  objectify: function(model) {
    // Does not support array in array schema or object in object

    if (!model || !model.schema || !model.schema.paths) {
      return {};
    }

    function objectify(paths) {
      var obj = {};
      for (var key in paths) {
        if (key === '_id' || key === '__v') {
          break;
        }
        if (paths.hasOwnProperty(key)) {
          var path = paths[key];
          if (path.instance === 'Array') {
            obj[key] = [objectify(path.schema.paths)];
          } else {
            var required = path.isRequired ? 'Required ' : 'Optional ';
            obj[key] = required + path.instance;
          }
        }
      }
      return obj;
    }

    return objectify(model.schema.paths);
  }
};
