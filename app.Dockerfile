FROM node:14

WORKDIR /srv/app

COPY ./package.json ./yarn.lock ./

RUN rm -rf node_modules && yarn install
