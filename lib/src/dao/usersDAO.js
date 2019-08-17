let users; // сущность коллекции, наследуемая от client driver

class usersDAO {
  static async injectDB(client) {
    if (users) {
      return;
    }
    try {
      users = await client.db(process.env.DB_NAME).collection('users'); // переменная users будет использована для работы с коллекцией
      // users, наследуется от db, которая наследуется для client
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }
  /**
   * Finds a user in the `users` collection
   * @param {string} email
   * @returns {Object | null}
   */

  static async getUser(email) {
    return users.findOne({ email });
  }

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
      // console.error(`Error occurred while ading new user, ${e}.`);
      return { error: `Error occurred while ading new user, ${e}.` };
    }
  }

  // static async deleteUser(email) {
  //   try {
  //     await users.deleteOne({ email });
  //   } catch (e) {
  //     console.error(`Error occurred while deleting user, ${e}`);
  //     return { error: e };
  //   }
  // }
}

module.exports = usersDAO;
