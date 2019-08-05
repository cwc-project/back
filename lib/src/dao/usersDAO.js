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

  static async getUser(email) {
    return users.findOne({ email });
  }
}

module.exports = usersDAO;
