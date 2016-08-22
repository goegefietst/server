var express = require('express');
var port = 3000;
var app = express();
var Q = require('Q');

console.log(getDateTime() + ': START');
loop(sleep, 1000);

function loop(fn, msTimeout) {
  function wrapper() {
    fn().then(
      function() {
        loop(fn, msTimeout);
      }
    );
  }
  setTimeout(wrapper, msTimeout);
}

app.listen(port, function() {
  //console.log('Express server listening on port ' + port);
});

function getDateTime() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? '0' : '') + hour;

  var min = date.getMinutes();
  min = (min < 10 ? '0' : '') + min;

  var sec = date.getSeconds();
  sec = (sec < 10 ? '0' : '') + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? '0' : '') + month;

  var day = date.getDate();
  day = (day < 10 ? '0' : '') + day;

  return year + ':' + month + ':' + day + ':' + hour + ':' + min + ':' + sec;

}

function sleep() {
  var deferred = Q.defer();
  var resolve = function() {
    console.log(getDateTime() + ': AFTER');
    deferred.resolve();
  };
  console.log(getDateTime() + ': BEFORE');
  setTimeout(resolve, 3000);
  return deferred.promise;
}

function blockingSleep(time) {
  var timestamp = new Date().getTime();
  while (new Date().getTime() < timestamp + time) {
  }
}
