const { MongoClient } = require('mongodb');
const app = require('./server');

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`); // eslint-disable-line no-console
});

MongoClient.connect(
  'mongodb+srv://cwcprjdevpaul:83pSX4VYromeOQ2T@cwc-project-hn2pd.mongodb.net/admin',
  {
    poolSize: 50,
    wtimeout: 2500,
    useNewUrlParser: true,
  },
)
  .catch(err => {
    console.error(err.stack); // eslint-disable-line no-console
    process.exit(1);
  })
  .then(async () => {
    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`); // eslint-disable-line no-console
    });
  });
