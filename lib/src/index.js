const { MongoClient } = require('mongodb');
const UsersDAO = require('./dao/usersDAO');
const ProjectsDAO = require('./dao/projectsDAO');
const TasksDAO = require('./dao/tasksDAO');
const app = require('./server');

const port = process.env.PORT || 5000;

MongoClient.connect(process.env.CWC_DB_URI, {
  poolSize: 50, // по умолчанию 5 pool connections
  wtimeout: 2500,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .catch(err => {
    console.error(err.stack); // eslint-disable-line no-console
    process.exit(1);
  })
  .then(async client => {
    await UsersDAO.injectDB(client);
    await ProjectsDAO.injectDB(client);
    await TasksDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`); // eslint-disable-line no-console
    });
  });
