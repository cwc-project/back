const router = require('express').Router();
const tasksCtrl = require('../controllers/tasks.controller');

router
  .route('')
  .post(tasksCtrl.apiAddTask)
  .delete(tasksCtrl.apiDeleteTask);

module.exports = router;
