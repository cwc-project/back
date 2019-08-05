const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const users = require('./api/routes/users');

const app = express();

app.use(cors());
app.get('env') === 'development' && app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/user', users);

module.exports = app;
