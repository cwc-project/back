// const { User } = require('./users');

// class ProjectsController {
//   static async getProjects(req, res) {
//     // извлекаем токен
//     const userJwt = req.get('Authorization').slice('Bearer '.length);
//     // проверка валидности токена + извлечение user claim
//     const userClaim = await User.decoded(userJwt);
//     const { err } = userClaim;
//     if (err) {
//       res.status(401).json({ error: err }); // 401 - невалидный токен
//       return;
//     }
//     const sessionsResponse = await UsersDAO.logoutUser(userClaim.email);
//   }
// }

// module.exports = ProjectsController;
