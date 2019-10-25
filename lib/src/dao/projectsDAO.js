let projects;

class ProjectsDAO {
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
   * Add new project to the `projects` collection
   * @param {string} title
   * @param {string} email
   * @returns {Object | Error} - Returns either an acknowledged
   * confirmation + id or an "error" Object
   */

  static async addProject(projectId, title) {
    try {
      return await projects.insertOne({ projectId, title });
    } catch (e) {
      return { error: `Error occurred while ading new project, ${e}.` };
    }
  }

  /**
   * Get a project from the `projects` collection by _id
   * @param {_id} ObjectId
   * @returns {Object | null} - Returns either a project Object or null
   */

  static async getProjectById(_id) {
    try {
      return await projects.findOne({ _id });
    } catch (e) {
      return { error: `Error occurred while getting a project, ${e}.` };
    }
  }

  /**
   * Returns all projects from the `projects` collection
   * @param {string} email
   * @returns {Array | null}
   */

  static getAllProjects = async email => projects.find({ email });
}

module.exports = ProjectsDAO;
