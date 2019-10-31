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
      return await projects.insertOne({
        projectId,
        title,
        dateAdded: new Date(),
      });
    } catch (e) {
      return { error: `Error occurred while ading new project, ${e}.` };
    }
  }

  /**
   * Returns all projects from the `projects` collection
   * @param {string} email
   * @returns {Array | null}
   */

  static async getAllProjects(projectId) {
    try {
      // в ответе будет возвращен курсор,
      // который нужно будет преобразовать в массив
      // этот метод должен возвращать непосредственно курсор,
      // но не объект return {a: cursor.toArray()};
      return await projects
        .find({ projectId })
        .project({ title: 1 })
        .toArray();
    } catch (e) {
      return { error: `Error occurred while getting projects, ${e}.` };
    }
  }
}

module.exports = ProjectsDAO;
