const { User } = require('./users.controller');
const TasksDAO = require('../../dao/tasksDAO');

class ProjectsController {
  static async apiAddTask(req, res) {
    const { title, projectId } = req.body;

    if (!title || typeof title !== 'string') {
      res
        .status(400)
        .json({ error: 'Bad task title format, expected string.' });
      return;
    }

    if (!projectId || typeof projectId !== 'string') {
      res.status(400).json({ error: 'Bad projectId format, expected string.' });
      return;
    }

    const userJwt = req.get('Authorization').slice('Bearer '.length);
    const userClaim = await User.verify(userJwt);
    const { err, userId } = userClaim;
    if (err) {
      res
        .status(401)
        .json({ error: `Invalid token, please try to log in again, ${err}` }); // 401 - невалидный токен
      return;
    }

    const addTaskResponse = await TasksDAO.addTask(title, projectId, userId);

    const { ops, error } = addTaskResponse;

    if (!ops) {
      res.status(500).json({ error });
      return;
    }

    const task = ops[0];
    res.json({
      task,
    });
  }

  static async apiDeleteTask(req, res) {
    const { id, projectId } = req.body;

    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Bad taskId format, expected string.' });
      return;
    }

    if (!projectId || typeof projectId !== 'string') {
      res.status(400).json({ error: 'Bad projectId format, expected string.' });
      return;
    }

    const userJwt = req.get('Authorization').slice('Bearer '.length);
    const userClaim = await User.verify(userJwt);
    const { err, userId } = userClaim;
    if (err) {
      res
        .status(401)
        .json({ error: `Invalid token, please try to log in again, ${err}` });
      return;
    }

    const deleteTaskResponse = await TasksDAO.deleteTask(id, projectId, userId);

    const { deletedCount, error } = deleteTaskResponse;

    if (deletedCount !== 1) {
      res.status(500).json({ error });
      return;
    }

    res.sendStatus(204);
  }

  static async apiEditTask(req, res) {
    const { taskKey, id, projectId } = req.body;
    if (!taskKey || typeof taskKey !== 'object') {
      res.status(400).json({ error: 'Bad field format, expected object.' });
      return;
    }

    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Bad taskId format, expected string.' });
      return;
    }

    if (!projectId || typeof projectId !== 'string') {
      res.status(400).json({ error: 'Bad projectId format, expected string.' });
      return;
    }

    const userJwt = req.get('Authorization').slice('Bearer '.length);
    const userClaim = await User.verify(userJwt);
    const { err, userId } = userClaim;
    if (err) {
      res
        .status(401)
        .json({ error: `Invalid token, please try to log in again, ${err}` });
      return;
    }

    const editTaskResponse = await TasksDAO.editTask(
      taskKey,
      id,
      projectId,
      userId,
    );

    const { task, error } = editTaskResponse;

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
