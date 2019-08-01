const express = require('express');
const bodyParser = require('body-parser');
// const path = require('path')
// const cors = require('./middlewares/cors')
const cors = require('cors');
// const morgan = require('morgan');
const users = require('./api/routes/users');

const app = express();
// console.log('app.get("env")', app.get('env'));

app.use(cors());
// app.get('env') === 'development' && app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api/user', users);

module.exports = app;
