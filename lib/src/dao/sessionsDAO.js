let sessions;

class SessionsDAO {
  static async injectDB(client) {
    if (sessions) return;
    try {
      sessions = await client.db(process.env.DB_NAME).collection('sessions');
    } catch (e) {
      throw new Error(e);
    }
  }

  static async getSession(email) {
    try {
      const { jwt } = await sessions.findOne({ user_id: email });
      return jwt;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async addSession(email, jwt) {
    try {
      await sessions.updateOne(
        { user_id: email }, // находим пользователя по user_id = email
        { $set: { jwt } }, // добавляем поле jwt, со значением jwt
        { upsert: true }, // если пользователя не существует, то создаем его
      );
      return { success: true };
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteSession(email) {
    try {
      // метод delete возвращает asknowledgement: true
      // даже если пользователя с таким email не существует
      await sessions.deleteOne({ user_id: email });
      return { success: true };
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = SessionsDAO;
