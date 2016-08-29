var Q = require('q');

var Cache = function(timeout) {
  this.dictionary = {};
  this.fns = [];
  if (timeout) {
    this.loop(timeout);
  }
};

Cache.prototype.getValue = function(key) {
  return this.dictionary[key];
};

Cache.prototype.setValue = function(key, value) {
  this.dictionary[key] = value;
};

Cache.prototype.addPair = function(pair) {
  this.dictionary[pair.key] = pair.value;
};

//takes key and function, replaces cache value of key with result of function on every iteration
//function should return promise
Cache.prototype.addFunction = function(key, fn) {
  this.fns.push(wrap(key, fn));
};

Cache.prototype.loop = function(msTimeout) {
  var cache = this;
  cache.timeout = setTimeout(wrapper, msTimeout);
  function wrapper() {
    var promises = [];
    for (var i = 0; i < cache.fns.length; i++) {
      promises.push(cache.fns[i]().then(cache.addPair.bind(cache)));
    }
    Q.allSettled(promises).then(function() {
      cache.loop(msTimeout);
    });
  }
};

Cache.prototype.stop = function() {
  if (this.timeout) {
    this.timeout.clearTimeout();
  }
};

function wrap(key, fn) {
  return function() {
    return fn().then(function(value) {
      return {key: key, value: value};
    });
  };
}

module.exports = Cache;
