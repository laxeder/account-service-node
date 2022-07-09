require("dotenv/config");

// const { PrismaClient } = require("@prisma/client");
const server = require("./src/server");
const logger = require("./src/infrastructure/config/logger");

//ACC063

server.listen(process.env.PORT, () => {
  logger.info(`port: ${process.env.PORT}`);
  logger.info(`author: ${process.env.AUTHOR}`);
  logger.info(`hostname: ${process.env.HOSTNAME}`);
  logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
});

// const prisma = new PrismaClient();

// criar uma conta

/*
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "xx@xx.com",
  "password": "123456",
  "confirm_password": "123456",
  "phone": "123456789",
  "birthdate": "01/01/1990",
  "cpf": "123456789",
  "rg": "123456789",
  "street": "Rua 1",
  "number": "1",
  "complement": "Apto 1",
  "neighborhood": "Bairro 1",
  "city": "Cidade 1",
  "state": "SP",
  "zipcode": "12345678",
  "nickname": "John Doe",
  "picture": " ",
  "description": "description",
  "profession": "profession",
  "company": "company",
} 
*/
