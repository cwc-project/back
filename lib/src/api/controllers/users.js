const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsersDAO = require('../../dao/usersDAO');

const hashPassword = pass => bcrypt.hash(pass, 10); // по умолчанию число раундов 10

const dataTypeErr = data => {
  const { name = '', email, pass } = data;
  if (typeof name !== 'string') {
    return { error: 'Bad name format, expected string.' };
  }
  if (!email || typeof email !== 'string') {
    return { error: 'Bad email format, expected string.' };
  }
  if (!pass || typeof pass !== 'string') {
    return { error: 'Bad password format, expected string.' };
  }
  return null;
};

class User {
  constructor({ name, email, pass } = {}) {
    this.name = name;
    this.email = email;
    this.pass = pass;
  }

  toJson = () => ({ name: this.name, email: this.email });

  comparePassword = plainText => bcrypt.compare(plainText, this.pass);

  encoded() {
    // синхронный метод
    return jwt.sign({ ...this.toJson() }, process.env.SECRET_KEY, {
      expiresIn: '4h',
    });
  }

  static async decoded(userJwt) {
    return jwt.verify(userJwt, process.env.SECRET_KEY, (err, res) => {
      if (err) return { err };
      return new User(res);
    });
  }
}

class UserController {
  static async register(req, res) {
    try {
      const typeErr = dataTypeErr({
        ...req.body,
        name: !req.body.name ? null : req.body.name,
      });

      if (typeErr) {
        res.status(400).json(typeErr);
        return;
      }
      const errors = {
        formatErr: {},
      };
      const regExps = {
        name: /.{1,}/i,
        email: /^[a-z0-9]+[\w-.]*@[a-z0-9]+[\w-.]*\.[a-z]{2,3}/i,
        pass: /^(?=.*\d)(?=.*[a-z])[\w!@#$%^&*]{6,}$/i,
      };

      const userFromBody = {
        ...req.body,
        name: req.body.name.trim(),
        email: req.body.email.trim().toLowerCase(),
      };

      if (userFromBody) {
        const { formatErr } = errors;
        !regExps.name.test(userFromBody.name) && (formatErr.nameErr = true);
        !regExps.email.test(userFromBody.email) && (formatErr.emailErr = true);
        !regExps.pass.test(userFromBody.pass) && (formatErr.passErr = true);
      }

      if (Object.keys(errors.formatErr).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const userInfo = {
        ...userFromBody,
        pass: await hashPassword(userFromBody.pass),
      };

      const insertResult = await UsersDAO.addUser(userInfo);
      if (!insertResult.success) {
        res.status(400).json({ error: insertResult.error });
        return;
      }
      // await UsersDAO.deleteUser(userInfo.email);
      // поиск добавленного пользователя в БД
      const userFromDB = await UsersDAO.getUser(userInfo.email);
      // если пользователь не найден, отправляем ошибку
      if (!userFromDB) {
        res.status(400).json({
          error: 'Internal error, please try again later.',
        });
        return;
      }
      // у экземпляра user даные из БД: хэшированный пароль, скорректированные данные
      const user = new User(userFromDB);

      res.json({
        auth_token: user.encoded(), // токен в методе register не записывается в коллекцию sessions
        info: user.toJson(),
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  static async login(req, res) {
    try {
      const typeErr = dataTypeErr(req.body);
      if (typeErr) {
        res.status(400).json(typeErr);
        return;
      }

      const email = req.body.email.trim().toLowerCase();
      const { pass } = req.body;

      const userData = await UsersDAO.getUser(email);
      if (!userData) {
        res.status(401).json({ error: 'Make sure your email is correct.' });
        return;
      }
      // создается экземляр класса, с данными из БД, где пароль храниться в виде хэша
      const user = new User(userData);
      if (!(await user.comparePassword(pass))) {
        res.status(401).json({ error: 'Make sure your password is correct' });
      }
      res.json(userData); // MY
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
}

module.exports = UserController;
