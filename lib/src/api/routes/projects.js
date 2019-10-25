const router = require('express').Router();
const projectsCtrl = require('../controllers/projects');

// при отправке get запроса по ссылке /projects
// будет возвращены все проекты
// может быть возвращать кол-во проектов и 20 последних проектов?
router.route('').post(projectsCtrl.addProject);

module.exports = router;
