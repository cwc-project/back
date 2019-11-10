const { User } = require('./users.controller');
const TodosDAO = require('../../dao/todosDAO');

class ProjectsController {
  static async addTodo(req, res) {
    const { todoId, title } = req.body;

    if (!todoId || typeof todoId !== 'string') {
      res.status(400).json({ error: 'Bad todoId format, expected string.' });
      return;
    }

    if (!title || typeof title !== 'string') {
      res
        .status(400)
        .json({ error: 'Bad todo title format, expected string.' });
      return;
    }

    const userJwt = req.get('Authorization').slice('Bearer '.length);
    const userClaim = await User.verify(userJwt);
    const { err } = userClaim;
    if (err) {
      res
        .status(401)
        .json({ error: `Invalid token, please try to log in again, ${err}` }); // 401 - невалидный токен
      return;
    }

    const addTodoResponse = await TodosDAO.addTodo(todoId, title);
    const { todo } = addTodoResponse;
    if (!todo) {
      res.status(500).json({ error: addTodoResponse.error });
      return;
    }

    res.json({
      todo,
    });
  }
}

module.exports = ProjectsController;
