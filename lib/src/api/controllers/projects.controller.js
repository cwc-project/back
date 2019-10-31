const { User } = require('./users.controller');
const SessionsDAO = require('../../dao/sessionsDAO');
const ProjectsDAO = require('../../dao/projectsDAO');

class ProjectsController {
  static async getProjects(req, res) {
    const userJwt = req.get('Authorization').slice('Bearer '.length);
    // проверка валидности токена + извлечение user claim
    const userClaim = await User.verify(userJwt);
    const { err, email } = userClaim;
    if (err) {
      res
        .status(401)
        .json({ error: `Invalid token, please try to log in again, ${err}` }); // 401 - невалидный токен
      return;
    }

    const sessionsResponse = await SessionsDAO.getSession(email);
    const { jwt } = sessionsResponse;

    if (!jwt) {
      res.status(500).json({ error: sessionsResponse.error });
      return;
    }

    if (jwt !== userJwt) {
      res.status(401).json({ error: 'session expired, please log in again' });
      return;
    }

    const getProjectsResponse = await ProjectsDAO.getAllProjects(email);
    // для курсоров нужно проверять error
    if (getProjectsResponse.error) {
      res.status(500).json({ error: getProjectsResponse.error });
      return;
    }

    res.json({
      projects: getProjectsResponse,
    });
  }

  static async addProject(req, res) {
    const { title } = req.body;
    if (!title || typeof title !== 'string') {
      res.status(400).json({ error: 'Bad title format, expected string.' });
      return;
    }
    // извлекаем токен
    const userJwt = req.get('Authorization').slice('Bearer '.length);
    // проверка валидности токена + извлечение user claim
    const userClaim = await User.verify(userJwt);
    const { err } = userClaim;

    if (err) {
      res
        .status(401)
        .json({ error: `Invalid token, please try to log in again, ${err}` }); // 401 - невалидный токен
      return;
    }

    const { email } = userClaim;
    const sessionsResponse = await SessionsDAO.getSession(email);
    const { jwt } = sessionsResponse;

    if (!jwt) {
      res.status(500).json({ error: sessionsResponse.error });
      return;
    }

    if (jwt !== userJwt) {
      res.status(401).json({ error: 'session expired, please log in again' });
      return;
    }
    const addProjectResponse = await ProjectsDAO.addProject(email, title);
    const { insertedId } = addProjectResponse;
    if (!insertedId) {
      res.status(500).json({ error: addProjectResponse.error });
      return;
    }

    res.json({
      id: insertedId,
    });
  }
}

module.exports = ProjectsController;
