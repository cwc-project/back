import { ObjectId } from 'bson';

let tasks;

class TasksDAO {
  static async injectDB(client) {
    if (tasks) return;
    try {
      tasks = await client.db(process.env.DB_NAME).collection('tasks');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Unable to establish collection handles in tasksDAO: ${e}`);
    }
  }

  /**
   * Add new task to the `tasks` collection
   * @param {string} taskId
   * @param {string} title
   * @returns {Object | Error} - Returns either an task Object or an "error" Object
   */

  static async addTask(title, projectId, userId) {
    try {
      const task = {
        title,
        projectId: new ObjectId(projectId),
        dateAdded: new Date(),
        completed: false,
        // overdue: false,
        userId: new ObjectId(userId),
      };

      const { ops } = await tasks.insertOne(task);

      return { ops };
    } catch (e) {
      return { error: `Error occurred while ading new task, ${e}.` };
    }
  }

  static async deleteTask(id, projectId, userId) {
    try {
      const { deletedCount } = await tasks.deleteOne({
        _id: new ObjectId(id),
        projectId: new ObjectId(projectId),
        userId: new ObjectId(userId),
      });

      return { deletedCount };
    } catch (e) {
      return { error: `Error occurred while deleting new task, ${e}.` };
    }
  }

  static async editTask(taskKey, id, projectId, userId) {
    try {
      const { value } = await tasks.findOneAndUpdate(
        {
          _id: new ObjectId(id),
          projectId: new ObjectId(projectId),
          userId: new ObjectId(userId),
        },
        { $set: { ...taskKey } },
        {
          returnOriginal: false,
        },
      );

      return { task: value };
    } catch (e) {
      return { error: `Error occurred while editing new task, ${e}.` };
    }
  }
}

module.exports = TasksDAO;
