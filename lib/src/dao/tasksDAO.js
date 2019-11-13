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

  static async addTask(title, taskId) {
    try {
      const { ops } = await tasks.insertOne({
        title,
        taskId: new ObjectId(taskId),
        dateAdded: new Date(),
        status: 'default',
      });

      return { ops };
    } catch (e) {
      return { error: `Error occurred while ading new task, ${e}.` };
    }
  }
}

module.exports = TasksDAO;
