import { ObjectId } from 'bson';

let todos;

class TodosDAO {
  static async injectDB(client) {
    if (todos) return;
    try {
      todos = await client.db(process.env.DB_NAME).collection('todos');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Unable to establish collection handles in todosDAO: ${e}`);
    }
  }

  /**
   * Add new todo to the `todos` collection
   * @param {string} todoId
   * @param {string} title
   * @returns {Object | Error} - Returns either an todo Object or an "error" Object
   */

  static async addTodo(todoId, title) {
    try {
      const { ops } = await todos.insertOne({
        todoId: new ObjectId(todoId),
        title,
        dateAdded: new Date(),
        status: 'untracked',
      });
      const todo = ops.next();
      return { todo };
    } catch (e) {
      return { error: `Error occurred while ading new todo, ${e}.` };
    }
  }
}

module.exports = TodosDAO;
