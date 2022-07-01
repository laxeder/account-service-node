const routes = require("express").Router();

const middleware = require("../middlewares/middlewares");
const health = require("./health");
const hello = require("./hello");
const host = require("./host");
const notFound = require("./notFound");
const internalError = require("./internalError");
const createAccount = require("./create-account");

routes.get("/health", middleware.ip, health);
routes.get("/hello", hello);
routes.get("/host", middleware.hostname, host);
routes.get("/notFound", notFound);
routes.get("/internalError", internalError);
routes.post("/account", createAccount);

module.exports = routes;