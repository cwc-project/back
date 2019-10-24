let projects;

class UsersDAO {
  static async injectDB(client) {
    if (projects) return;
    try {
      // users, наследуется от db, которая наследуется для client
      projects = await client.db(process.env.DB_NAME).collection('projects');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        `Unable to establish collection handles in projectsDAO: ${e}`,
      );
    }
  }

  /**
   * Returns all projects from the `projects` collection
   * @param {string} email
   * @returns {Array | null}
   */

  static getProjects = async email => projects.find({ email });
}

module.exports = UsersDAO;
