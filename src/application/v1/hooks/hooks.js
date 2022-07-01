const routes = require('express').Router();

const tty = require('./tty');
routes.post("/tty", tty);

module.exports = routes;
