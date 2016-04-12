var UserController = require('../controllers/users.js');

module.exports = function(router) {

  router.route('/user').post(function(req, res) {
    if (req.body.uuid) {
      //TODO
    } else {
      var params = {};
      params.res = res;
      UserController.generateUser(params);
    }
  });
};
