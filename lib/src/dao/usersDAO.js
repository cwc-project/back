const SessionsDAO = require('./sessionsDAO');

let users;
// let sessions;
// сущность коллекции, наследуемая от client driver

class UsersDAO {
  static async injectDB(client) {
    if (users) return;
    // if (users) return;
    try {
      // users, наследуется от db, которая наследуется для client
      users = await client.db(process.env.DB_NAME).collection('users'); // переменная users будет использована для работы с коллекцией
      // sessions = await client.db(process.env.DB_NAME).collection('sessions');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  /**
   * Finds a user in the `users` collection
   * @param {string} email
   * @returns {Object | null}
   */

  static getUser = async email => users.findOne({ email });

  /**
   * Adds a user to the `users` collection
   * For searching acceleration by email and to aviod email duplication
   * collection users shoud be patch as follows (via mongoShell with admin access)
   * use cwc
   * db.users.createIndex({email: 1}, {unique: true})
   * @param {Object} userInfo - The information of the user to add
   * @returns {'success' | Error } Returns either a "success" or an "error" Object
   */

  static async addUser(userInfo) {
    try {
      await users.insertOne({ ...userInfo }, { w: 'majority' }); // подтвеждение записи в БД от primary и от secondaries, число реплик предоставивших ответ на 1 больше чем половина
      // если в процессе произошла ошибка, то сразу срабатывает блок catch
      return { success: true };
    } catch (e) {
      if (String(e).startsWith('MongoError: E11000 duplicate key error')) {
        return { error: 'A user with given email already exists.' };
      }
      return { error: `Error occurred while ading new user, ${e}.` };
    }
  }

  /**
   * Add user to the `sessions` collection
   * @param {stirng} email - user email === user_id in `sessions` collection
   * @param {string} jwt - token with elapse time 4h
   * @returns {'success' | Error} - Returns either a "success" or an "error" Object
   */

  static async loginUser(email, jwt) {
    try {
      const sessionsResponse = await SessionsDAO.addSession(email, jwt);
      return sessionsResponse;
    } catch (e) {
      return { error: `Error occurred while logging in user, ${e}` };
    }
  }

  /**
   * Removes a user by user_id(email) from the `sessions` collection
   * @param {string} email - user email === user_id in `sessions` collection
   * @returns {'success' | Error} - Returns either a "success" or an "error" Object
   */

  static async logoutUser(email) {
    try {
      const sessionsResponse = await SessionsDAO.deleteSession(email);
      return sessionsResponse;
    } catch (e) {
      return { error: `Error occurred while logging out user, ${e}` };
    }
  }
  //   // static async deleteUser(email) {
  //   //   try {
  //   //     await users.deleteOne({ email });
  //   //   } catch (e) {
  //   //     console.error(`Error occurred while deleting user, ${e}`);
  //   //     return { error: e };
  //   //   }
  //   // }
}

module.exports = UsersDAO;
