const { User } = require('./users.controller');
const ProjectsDAO = require('../../dao/projectsDAO');

class ProjectsController {
  static async apiGetProjects(req, res) {
    const userJwt = req.get('Authorization').slice('Bearer '.length);
    const userClaim = await User.verify(userJwt);
    const { err, userId } = userClaim;

    if (err) {
      res
        .status(401)
        .json({ error: `Invalid token, please try to log in again, ${err}` }); // 401 - невалидный токен
      return;
    }

    const getProjectsResponse = await ProjectsDAO.getProjects(userId);
    if (getProjectsResponse.error) {
      res.status(500).json({ error: getProjectsResponse.error });
      return;
    }
    const { projectsList, projectsAmount } = getProjectsResponse;
    res.json({
      projectsList,
      projectsAmount,
    });
  }

  static async apiGetProject(req, res) {
    const userJwt = req.get('Authorization').slice('Bearer '.length);
    const userClaim = await User.verify(userJwt);
    const { err, userId } = userClaim;
    // сделать отдельным методом (придется передавать res, в качестве аргумента)
    if (err) {
      res
        .status(401)
        .json({ error: `Invalid token, please try to log in again, ${err}` }); // 401 - невалидный токен
      return;
    }

    const { id } = req.params;

    const getProjectResponse = await ProjectsDAO.getProject(id, userId);

    const { project, error } = getProjectResponse;

    if (!project) {
      res.status(500).json({ error });
      return;
    }

    res.json({
      project,
    });
  }

  static async apiAddProject(req, res) {
    const { title } = req.body;
    if (!title || typeof title !== 'string') {
      res.status(400).json({ error: 'Bad title format, expected string.' });
      return;
    }

    const userJwt = req.get('Authorization').slice('Bearer '.length);

    const userClaim = await User.verify(userJwt);
    const { err, userId } = userClaim;

    if (err) {
      res
        .status(401)
        .json({ error: `Invalid token, please try to log in again, ${err}` }); // 401 - невалидный токен
      return;
    }

    const addProjectResponse = await ProjectsDAO.addProject(title, userId);
    const { insertedId } = addProjectResponse;
    if (!insertedId) {
      res.status(500).json({ error: addProjectResponse.error });
      return;
    }

    res.json({
      insertedId,
    });
  }

  static async apiDeleteProject(req, res) {
    const userJwt = req.get('Authorization').slice('Bearer '.length);
    const userClaim = await User.verify(userJwt);
    const { err, userId } = userClaim;

    if (err) {
      res
        .status(401)
        .json({ error: `Invalid token, please try to log in again, ${err}` }); // 401 - невалидный токен
      return;
    }

    const { id } = req.params;

    const getProjectResponse = await ProjectsDAO.deleteProject(id, userId);

    const { deletedCount, error } = getProjectResponse;

    if (deletedCount !== 1) {
      res.status(500).json({ error });
      return;
    }

    res.sendStatus(204);
  }
}

module.exports = ProjectsController;
