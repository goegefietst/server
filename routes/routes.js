var RouteController = require('../controllers/routes.js');
var UserController = require('../controllers/users.js');

module.exports = function(router) {
  router.route('/routes').get(function(req, res) {
    var params = {};
    params.res = res;
    params.req = req;
    RouteController.getRoutes(params);
  });

  router.route('/route/{uuid}').post(function(req, res) {
    var params = {};
    params.res = res;
    params.req = req;
    params.uuid = req.params.uuid;
    UserController.checkUserInfo(params.uuid, req.body.secret, params,
      RouteController.saveRoute, RouteController.notFound);
  });

  router.route('/route/{uuid}.json').get(function(req, res) {
    var params = {};
    params.res = res;
    params.req = req;
    params.uuid = req.params.uuid;
    params.secret = req.header('secret');
    UserController.checkUserInfo(params.uuid, params.secret, params,
      RouteController.getRoutes, RouteController.notFound);
  });

  router.route('/route/{uuid}').get(function(req, res) {
    res.status(303).redirect('/user/' + req.params.uuid + '.json');
  });

};
