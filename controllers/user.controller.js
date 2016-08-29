var UserService = require('../services/user.service.js');

var UserController = function(router) {

  //fixme changed from /user to /users, change in app accordingly
  router.route('/users').post(function(req, res) {
    if (req.body.uuid) {
      //Fixme try to remember what this should be for
    } else {
      //console.log('Trying to generate user');
      //UserService.generateUser().then(respond).catch(error);
    }

    UserService.generateUser().then(respond).catch(error);

    function respond(user) {
      return res.status(201).json({
        message: 'User generated!',
        uuid: user.uuid,
        secret: user.secret
      });
    }

    function error(err) {
      if (err && err.status && err.message) {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send({
          message: 'Internal server error'
        });
      }
    }
  });

};

module.exports = UserController;
