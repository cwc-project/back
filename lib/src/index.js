const { MongoClient } = require('mongodb');
const UsersDAO = require('./dao/usersDAO');
const app = require('./server');

const port = process.env.PORT || 5000;

MongoClient.connect(process.env.CWC_DB_URI, {
  poolSize: 50,
  wtimeout: 2500,
  useNewUrlParser: true,
})
  .catch(err => {
    console.error(err.stack); // eslint-disable-line no-console
    process.exit(1);
  })
  .then(async client => {
    await UsersDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`); // eslint-disable-line no-console
    });
  });
