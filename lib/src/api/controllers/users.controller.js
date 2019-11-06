const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsersDAO = require('../../dao/usersDAO');
const nodemailer = require('../../middleware/nodemailer');

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
    return jwt.sign({ ...this.toJson() }, process.env.SECRET_KEY, {
      expiresIn: '14h',
    });
  }

  static async verify(userJwt) {
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

      const insertResponse = await UsersDAO.addUser(userInfo);
      if (!insertResponse.success) {
        res.status(400).json({ error: insertResponse.error });
        return;
      }

      // поиск добавленного пользователя в БД
      const userFromDB = await UsersDAO.getUser(userInfo.email);
      // если пользователь не найден, отправляем ошибку
      if (!userFromDB) {
        res.status(500).json({
          error: 'Internal error, please try again later.',
        });
        return;
      }

      // у экземпляра user даные из БД: хэшированный пароль, скорректированные данные
      const user = new User(userFromDB);

      try {
        // перенести сообщение в nodemailer ?
        const message = {
          to: user.email,
          subject: 'CWC2 registration confirmation',
          html: `
            <h3>Dear, ${user.name}</h3>
            <p>thank you for registration!</p>
            <p>Now you joined to
            <a href='https://cwc-project.github.io/'>CWC2</a>.</p>
            <p>If you have any questions, please feel free to ask.</p>

            <p>If you didn't register on CWC2 application,
            please ignore this mail.<p>

            Best regards,<br />
            CWC team`,
        };
        nodemailer.send(message);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Nodemailer error: ', e);
      }

      // const loginResponse = await UsersDAO.loginUser(
      //   user.email,
      //   user.encoded(),
      // );

      // if (!loginResponse.jwt) {
      //   res.status(500).json({ error: loginResponse.error });
      //   return;
      // }

      res.json({
        authToken: user.encoded(),
        info: user.toJson(),
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  static async login(req, res) {
    // все токены, сгенерированные в этом методе будут иметь одинаковый iat
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
        return;
      }
      // const loginResponse = await UsersDAO.loginUser(
      //   user.email,
      //   user.encoded(),
      // );

      // if (!loginResponse.jwt) {
      //   res.status(500).json({ error: loginResponse.error });
      //   return;
      // }

      res.json({
        authToken: user.encoded(),
        info: user.toJson(),
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  // static async logout(req, res) {
  //   try {
  //     // req.get('header name') - возвращает значение указанного заголовка,
  //     // название заголовка можно писать без учета регстра
  //     // http://expressjs.com/ru/api.html#req.get
  //     // метод slice, помимо массивов, работает со строками
  //     // в метод передается число символов, которое будет отброшено с начала строки
  //     // в итоге будет получено значение токено из заголовка клиентского запроса
  //     const userJwt = req.get('Authorization').slice('Bearer '.length);
  //     // создается новый экзепляр класса User,
  //     // который будет называтся не user, а userJwt, с данными из claims jwt:
  //     // (email, name, iat (iat будет проигнорирован))
  //     const userClaim = await User.verify(userJwt);
  //     // err возвращается методом verify в случае ошибки
  //     const { err } = userClaim;
  //     if (err) {
  //       res
  //         .status(401)
  //         .json({ error: `Invalid token, please try to log in again, ${err}` });
  // 401 - невалидный токен
  //       return;
  //     }
  //     const logoutResponse = await UsersDAO.logoutUser(userClaim.email);
  //     if (!logoutResponse.success) {
  //       res.status(500).json({ error: logoutResponse.error });
  //       return;
  //     }
  //     // если не произошло ошибки, то на клиент вернется { success: true }
  //     res.json(logoutResponse);
  //   } catch (e) {
  //     res.status(500).json({ error: e });
  //   }
  // }
}

module.exports = {
  User,
  UserController,
};
