let sessions;

class SessionsDAO {
  static async injectDB(client) {
    if (sessions) return;
    try {
      sessions = await client.db(process.env.DB_NAME).collection('sessions');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        `Unable to establish collection handles in sessionsDAO: ${e}`,
      );
    }
  }

  /**
   * Gets currrent user's session by user_id(email) from the `sessions` collection
   * @param {string} email - user email === user_id in `sessions` collection
   * @returns {'jwt' | Error} - Returns either a jwt string or an "error" Object
   */

  static async getSession(email) {
    try {
      const { jwt } = await sessions.findOne(
        { user_id: email },
        { projection: { _id: 0, jwt: 1 } },
      );
      return { jwt };
    } catch (e) {
      return { error: e };
    }
  }

  /**
   * Add user to the `sessions` collection
   * @param {stirng} email - user email === user_id in `sessions` collection
   * @param {string} jwt - token with elapse time 14h
   * @returns {'success' && 'jwt' | Error} - Returns either a "success" object from sessionsDAO
   * and jwt string from request or an "error" Object
   */

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
