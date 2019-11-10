const router = require('express').Router();
const todosCtrl = require('../controllers/todos.controller');

router.route('').post(todosCtrl.addTodo);

module.exports = router;
