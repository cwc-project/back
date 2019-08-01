const router = require('express').Router();
const usersCtrl = require('../controllers/users');
// const router = express.Router()
// import usersCtrl from '../controllers/users'

// const router = new Router()

// router.route('/register').post(usersCtrl.register)
router.route('/login').get(usersCtrl.login);
// router.route('/logout').post(usersCtrl.logout)

module.exports = router;
