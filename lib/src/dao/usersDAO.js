let users;

class UsersDAO {
  static async injectDB(client) {
    if (users) return;
    try {
      users = await client.db(process.env.DB_NAME).collection('users');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(
        `Unable to establish collection handles in userDAO: ${err}`,
      );
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
      await users.insertOne({ ...userInfo }, { w: 'majority' }); // подтвеждение записи в БД от primary и от secondaries,
      // число реплик предоставивших ответ на 1 больше чем половина
      return { success: true };
    } catch (err) {
      if (String(err).startsWith('MongoError: E11000 duplicate key error')) {
        return { error: 'A user with given email already exists.' };
      }
      return { error: `Error occurred while ading new user, ${err}.` };
    }
  }
}

module.exports = UsersDAO;
