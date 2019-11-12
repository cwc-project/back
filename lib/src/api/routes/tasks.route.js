const router = require('express').Router();
const tasksCtrl = require('../controllers/tasks.controller');

router.route('').post(tasksCtrl.addTask);

module.exports = router;
