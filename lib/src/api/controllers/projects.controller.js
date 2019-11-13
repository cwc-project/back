const { User } = require('./users.controller');
const ProjectsDAO = require('../../dao/projectsDAO');

class ProjectsController {
  static async apiGetProjects(req, res) {
    const userJwt = req.get('Authorization').slice('Bearer '.length);
    const userClaim = await User.verify(userJwt);
    const { err, email } = userClaim;
    if (err) {
      res
        .status(401)
        .json({ error: `Invalid token, please try to log in again, ${err}` }); // 401 - невалидный токен
      return;
    }

    const getProjectsResponse = await ProjectsDAO.getProjects(email);
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
    const { err, email } = userClaim;
    // сделать отдельным методом (придется передавать res, в качестве аргумента)
    if (err) {
      res
        .status(401)
        .json({ error: `Invalid token, please try to log in again, ${err}` }); // 401 - невалидный токен
      return;
    }

    const { id } = req.params;

    const getProjectResponse = await ProjectsDAO.getProject(id, email);

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
    const { err } = userClaim;

    if (err) {
      res
        .status(401)
        .json({ error: `Invalid token, please try to log in again, ${err}` }); // 401 - невалидный токен
      return;
    }

    const { email } = userClaim;

    const addProjectResponse = await ProjectsDAO.addProject(title, email);
    const { insertedId } = addProjectResponse;
    if (!insertedId) {
      res.status(500).json({ error: addProjectResponse.error });
      return;
    }

    res.json({
      insertedId,
    });
  }
}

module.exports = ProjectsController;
