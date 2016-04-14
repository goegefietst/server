var UserController = require('../controllers/users.js');

module.exports = function(router) {

  router.route('/user').post(function(req, res) {
    if (req.body.uuid) {
      //TODO
    } else {
      console.log('Trying to generate user');
      UserController.generateUser().then(respond).catch(error);
    }

    function respond(user) {
      return res.status(201).json({
        message: 'User generated!',
        uuid: user.uuid,
        secret: user.secret
      });
    }

    function error() {
      res.status(500).send({
        message: 'Failed to create a new user.'
      });
    }
  });
};
