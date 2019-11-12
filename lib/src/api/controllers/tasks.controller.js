const { User } = require('./users.controller');
const TasksDAO = require('../../dao/tasksDAO');

class ProjectsController {
  static async addTask(req, res) {
    const { taskId, title } = req.body;

    if (!taskId || typeof taskId !== 'string') {
      res.status(400).json({ error: 'Bad taskId format, expected string.' });
      return;
    }

    if (!title || typeof title !== 'string') {
      res
        .status(400)
        .json({ error: 'Bad task title format, expected string.' });
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

    const addTaskResponse = await TasksDAO.addTask(taskId, title);
    const { task, error } = addTaskResponse;
    if (!task) {
      res.status(500).json({ error });
      return;
    }

    res.json({
      task,
    });
  }
}

module.exports = ProjectsController;
