const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Inicia o servidor
const app = express();

const prisma = require("./application/v1/middlewares/prisma.middleware");
const routes = require("./application/v1/routes/routes");
const hooks = require("./application/v1/hooks/hooks");
const routines = require("./infrastructure/routines/routines");

const notFound = require("./application/v1/routes/not-found");

// Configura o servidor
app.use(cors()); //cross origin resouce sharing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(routines());

// Adiciona o prisma em todas as rotas
app.use(prisma);

// Adiciona as rotas no servidor
app.use("/api/v1", routes);

// Adiciona os hooks no servidor
app.use("/api/v1/hooks", hooks);

// Adiciona rota para página não encontrada
app.use(notFound);

module.exports = app;
