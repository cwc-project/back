const { User } = require('./users.controller');
const TasksDAO = require('../../dao/tasksDAO');

class ProjectsController {
  static async apiAddTask(req, res) {
    const { title, projectId } = req.body;

    if (!projectId || typeof projectId !== 'string') {
      res.status(400).json({ error: 'Bad projectId format, expected string.' });
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

    const addTaskResponse = await TasksDAO.addTask(title, projectId);

    const { ops, error } = addTaskResponse;

    if (!ops) {
      res.status(500).json({ error });
      return;
    }

    res.json({
      task: ops[0],
    });
  }

  static async apiDeleteTask(req, res) {
    const { title, taskId } = req.body;

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

    const addTaskResponse = await TasksDAO.addTask(title, taskId);

    const { ops, error } = addTaskResponse;

    // const { task, error } = addTaskResponse;
    if (!ops) {
      res.status(500).json({ error });
      return;
    }

    res.json({
      task: ops[0],
    });
  }
}

module.exports = ProjectsController;
