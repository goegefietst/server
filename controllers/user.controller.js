var UserController = function(router, services) {
  var userService = services.user;

  router.route('/users').post(function(req, res) {
    userService.generateUser().then(respond).catch(error);

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
