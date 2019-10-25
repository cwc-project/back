const { User } = require('./users');
const SessionsDAO = require('../../dao/sessionsDAO');
// const ProjectsDAO = require('../../dao/projectsDAO');

// начать с AddProject
class ProjectsController {
  // static async getProjects(req, res) {
  //   // извлекаем токен
  //   const userJwt = req.get('Authorization').slice('Bearer '.length);
  //   // проверка валидности токена + извлечение user claim
  //   const userClaim = await User.decoded(userJwt);
  //   const { err } = userClaim;
  //   if (err) {
  //     res.status(401).json({ error: err }); // 401 - невалидный токен
  //     return;
  //   }
  //   const sessionsResponse = await UsersDAO.logoutUser(userClaim.email);
  // }

  static async addProject(req, res) {
    // извлекаем токен
    const userJwt = req.get('Authorization').slice('Bearer '.length);
    // проверка валидности токена + извлечение user claim
    const userClaim = await User.decoded(userJwt);
    const { err } = userClaim;

    if (err) {
      res.status(401).json({ error: err }); // 401 - невалидный токен
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
      res.status(401).json({ error: 'session expired' });
      return;
    }

    const { title } = req.body;
    console.log(title);
    // const addProjectResponse = await ProjectsDAO.addProject(email, title);
    //   if (addProjectResponse.error) {
    //     res.status(500).json({ error: addProjectResponse.error });
    //     return;
    //   }

    //   const { insertedId } = addProjectResponse;
    //   console.log(insertedId, 'insertedId')
  }
}

module.exports = ProjectsController;
