const express = require('express');
const bodyParser = require('body-parser');
// const path = require('path')
// const cors = require('./middlewares/cors')
const cors = require('cors');
const users = require('./api/routes/users');

const app = express();

app
  .use(cors())
  .use(bodyParser.json())
  .use('/api/user', users);

module.exports = app;
