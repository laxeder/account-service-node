const routes = require("express").Router();

const middleware = require("../middlewares/middlewares");

// Obter todas as rotas
const health = require("./health");
const prismaHealth = require("./prisma-health");
const keysPair = require("./keys-pair");

const updateAccountPassword = require("./update-account-password");
const updateAccountByEmail = require("./update-account-by-email");
const updateAccountByPhone = require("./update-account-by-phone");
const updateAccount = require("./update-account");

const showAccountByEmail = require("./show-account-by-email");
const showAccountByPhone = require("./show-account-by-phone");

const listAccountsByName = require("./list-accounts-by-name");
const listAccountsByEmail = require("./list-accounts-by-email");
const listAccountsByPhone = require("./list-accounts-by-phone");
const listAccounts = require("./list-accounts");

const restoreAccount = require("./restore-account");
const createAccount = require("./create-account");
const deleteAccount = require("./delete-account");
const loginAccount = require("./login-account");
const showAccount = require("./show-account");

const notFound = require("./not-found");
const internalError = require("./internal-error");

// Adicionar rotas
routes.get("/mysql/health", prismaHealth);
routes.get("/keys-pair", keysPair);
routes.get("/health", health);

routes.post("/account/login", loginAccount);

routes.get("/accounts/email/:email", listAccountsByEmail);
routes.get("/account/email/:email", showAccountByEmail);
routes.put("/account/email/:email", updateAccountByEmail);

routes.get("/accounts/phone/:phone", listAccountsByPhone);
routes.get("/account/phone/:phone", showAccountByPhone);
routes.put("/account/phone/:phone", updateAccountByPhone);

routes.get("/accounts/name/:name", listAccountsByName);
routes.put("/account/restore/:uuid", restoreAccount);
routes.put("/account/password/:uuid", updateAccountPassword);

routes.put("/account/:uuid", updateAccount);
routes.get("/account/:uuid", showAccount);
routes.delete("/account/:uuid", deleteAccount);
routes.get("/accounts", listAccounts);
routes.post("/account", createAccount);

routes.get("/notFound", notFound);
routes.get("/internalError", internalError);

module.exports = routes;
