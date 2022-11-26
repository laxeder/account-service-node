#!/usr/bin/env node
## Node alpine
FROM node:16.18.0-buster AS build

## Configurando variáveis de Ambiente
ENV APP_HOME=/usr/production-node

## diretorio de trabalho
WORKDIR "$APP_HOME"

## Arquivos de iniciacao para o node
COPY package*.json ./

## install dependences com permissoes root
RUN npm ci --force
RUN npm audit fix --force

## Copia projeto
COPY . .

# Máquina de produção
FROM build as build-prod

WORKDIR "$APP_HOME"

ENV NODE_ENV="production"

LABEL description="production-node"

LABEL org.opencontainers.image.name="production-node"
LABEL org.opencontainers.image.authors="laxederbr@gmail.com"
LABEL org.opencontainers.image.hostname="production-node"

LABEL com.docker.volume.name='production-node'
LABEL com.docker.network.bridge.name='production-node'

# install ferramentas de deploy
RUN npm install npm@9.1.2
RUN npm install node-gyp -g
RUN npm install pm2 -g
RUN npm install -g nodemon
RUN npm install -g prisma
RUN npm install

## porta de acesso
EXPOSE 9000

## start do ambiente
CMD [ "pm2-runtime", "npm", "--", "run", "prod" ]
