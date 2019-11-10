import { ObjectId } from 'bson';

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
        status: 'default',
      });
    } catch (e) {
      return { error: `Error occurred while ading new project, ${e}.` };
    }
  }

  static getProject = async (id, projectId) => {
    try {
      const project = await projects.findOne(
        { _id: new ObjectId(id), projectId },
        { projection: { projectId: 0 } },
      );
      return { project };
    } catch (err) {
      return { error: `Error occurred while getting projects, ${err}.` };
    }
  };

  /**
   * Returns all projects from the `projects` collection
   * @param {string} email
   * @returns {Array | null}
   */

  static async getProjects(projectId) {
    const query = { projectId };
    let cursor;
    try {
      // в ответе будет возвращен курсор,
      // который нужно будет преобразовать в массив
      // этот метод должен возвращать непосредственно курсор,
      // но не объект return {a: cursor.toArray()};
      cursor = await projects
        .find(query)
        .project({ projectId: 0 })
        .sort([['dateAdded', -1]]);
      // .sort({ dateAdded: -1 }); // тоже работает
    } catch (err) {
      return { error: `Error occurred while getting projects, ${err}.` };
    }

    try {
      // получаем количество проктов (пригодится для подключеия pagination)
      const projectsList = await cursor.toArray();
      const projectsAmount = await projects.countDocuments(query);
      return { projectsList, projectsAmount };
    } catch (e) {
      return {
        error: `Projects: Unable to convert cursor to array or problem counting documents, ${e}`,
      };
    }
  }
}

module.exports = ProjectsDAO;
