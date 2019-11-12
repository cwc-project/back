const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const users = require('./api/routes/users.route');
const projects = require('./api/routes/projects.route');
const tasks = require('./api/routes/tasks.route');

const app = express();

app.use(cors());
app.get('env') === 'development' && app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/user', users);
app.use('/api/projects', projects);
app.use('/api/tasks', tasks);

module.exports = app;
