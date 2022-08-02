const routes = require('express').Router();

//Obtem todas as hooks
const tty = require('./tty');
routes.post("/tty", tty);

module.exports = routes;
