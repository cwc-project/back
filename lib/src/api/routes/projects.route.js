const router = require('express').Router();
const projectsCtrl = require('../controllers/projects.controller');

// при отправке get запроса по ссылке /projects
// будет возвращены все проекты
// может быть возвращать кол-во проектов и 20 последних проектов?

router.route('/:id').get(projectsCtrl.apiGetProject);

router
  .route('')
  .get(projectsCtrl.apiGetProjects)
  .post(projectsCtrl.apiAddProject);

module.exports = router;
