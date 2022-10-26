#!/usr/bin/env node
## Node alpine
FROM node:alpine AS build

## diretorios de trabalho
WORKDIR /usr/production-node

## Arquivos de iniciacao para o node
COPY package*.json ./

## install dependences com permissoes root
RUN npm install node
RUN npm ci --force
RUN npm audit fix --force

## Copia projeto
COPY . .

## alterar permissões para o formato linux
RUN find ./prisma -type f -print0 | xargs -0 sed -i 's/\r$//'
RUN find ./src -type f -print0 | xargs -0 sed -i 's/\r$//'
RUN find ./prisma -type d -print0 | xargs -0 chmod 755  
RUN find ./src -type d -print0 | xargs -0 chmod 755  
RUN find ./prisma -type f -print0 | xargs -0 chmod 644
RUN find ./src -type f -print0 | xargs -0 chmod 644
RUN cd ./prisma && chmod -R +x *.js
RUN cd ./src && chmod -R +x *.js
RUN chmod -R +x ./app.js



# Máquina de produção
FROM node:alpine

ENV NODE_ENV="production"

LABEL description="production-node"

LABEL org.opencontainers.image.name="production-node"
LABEL org.opencontainers.image.authors="laxederbr@gmail.com"
LABEL org.opencontainers.image.hostname="production-node"

LABEL com.docker.volume.name='production-node'
LABEL com.docker.network.bridge.name='production-node'

# install ferramentas de deploy
RUN npm install node-gyp -g
RUN npm install pm2 -g
RUN npm install -g nodemon
RUN npm install -g yarn --force

COPY --from=build /usr/production-node /

## porta de acesso
EXPOSE 9000

## start do ambiente
CMD [ "pm2-runtime", "npm", "--", "run", "prod:linux" ]
