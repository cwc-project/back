// export class User {

// }

const user = {
  name: 'Paul',
  token: 'asfs3221',
};

class UserController {
  static async login(req, res) {
    res.json(user);
  }
}

module.exports = UserController;
