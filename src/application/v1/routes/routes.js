const routes = require("express").Router();

const { tokenVerify } = require("../middlewares/middlewares");

// Obter todas as rotas
const prismaHealth = require("./prisma-health");
const keysPair = require("./keys-pair");
const health = require("./health");

const updateAccountPassword = require("./update-account-password");
const updateAccountByEmail = require("./update-account-by-email");
const updateAccountByPhone = require("./update-account-by-phone");
const updateAccount = require("./update-account");

const showAccountByEmail = require("./show-account-by-email");
const showAccountByPhone = require("./show-account-by-phone");

const listAccountsByEmail = require("./list-accounts-by-email");
const listAccountsByPhone = require("./list-accounts-by-phone");
const listAccountsByName = require("./list-accounts-by-name");
const listAccounts = require("./list-accounts");

const restoreAccount = require("./restore-account");
const createAccount = require("./create-account");
const deleteAccount = require("./delete-account");
const loginAccount = require("./login-account");
const showAccount = require("./show-account");

const internalError = require("./internal-error");
const notFound = require("./not-found");

// Adicionar rotas
routes.get("/mysql/health", prismaHealth);
routes.get("/keys-pair", keysPair);
routes.get("/health", health);

routes.post("/account/login", loginAccount);

routes.get("/accounts/email/:email", tokenVerify, listAccountsByEmail);
routes.get("/account/email/:email", tokenVerify, showAccountByEmail);
routes.put("/account/email/:email", tokenVerify, updateAccountByEmail);

routes.get("/accounts/phone/:phone", tokenVerify, listAccountsByPhone);
routes.get("/account/phone/:phone", tokenVerify, showAccountByPhone);
routes.put("/account/phone/:phone", tokenVerify, updateAccountByPhone);

routes.get("/accounts/name/:name", tokenVerify, listAccountsByName);
routes.put("/account/password/:uuid", tokenVerify, updateAccountPassword);
routes.put("/account/restore/:uuid", tokenVerify, restoreAccount);

routes.put("/account/:uuid", tokenVerify, updateAccount);
routes.get("/account/:uuid", tokenVerify, showAccount);
routes.delete("/account/:uuid", tokenVerify, deleteAccount);
routes.get("/accounts", tokenVerify, listAccounts);
routes.post("/account", createAccount);

routes.get("/notFound", notFound);
routes.get("/internalError", internalError);

module.exports = routes;
