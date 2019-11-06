const router = require('express').Router();
const {
  UserController: usersCtrl,
} = require('../controllers/users.controller');

router.route('/register').post(usersCtrl.register);
router.route('/login').post(usersCtrl.login);
// router.route('/logout').post(usersCtrl.logout);

module.exports = router;
