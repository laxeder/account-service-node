const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const routes = require('./application/v1/routes/routes');
const hooks = require('./application/v1/hooks/hooks');
const routines = require('./infrastructure/routines/routines');

const notFound = require('./application/v1/routes/notFound');

app.use(cors()); //cross origin resouce sharing 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(routines());
app.use('/api/v1', routes);
app.use('/api/v1/hooks', hooks);
app.use(notFound);

module.exports = app;