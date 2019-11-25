const router = require('express').Router();
const projectsCtrl = require('../controllers/projects.controller');

router.route('/:id').get(projectsCtrl.apiGetProject);
// .delete(projectsCtrl.delete);

router
  .route('')
  .get(projectsCtrl.apiGetProjects)
  .post(projectsCtrl.apiAddProject);

module.exports = router;
