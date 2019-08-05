const UsersDAO = require('../../dao/usersDAO');
// export class User {

// }

class UserController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || typeof email !== 'string') {
        res.status(400).json({ error: 'Bad email format, expected string.' });
        return;
      }
      if (!password || typeof password !== 'string') {
        res
          .status(400)
          .json({ error: 'Bad password format, expected string.' });
        return;
      }
      const userData = await UsersDAO.getUser(email);
      if (!userData) {
        res.status(401).json({ error: 'Make sure your email is correct.' });
        return;
      }
      res.json(userData); // my
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
}

module.exports = UserController;
