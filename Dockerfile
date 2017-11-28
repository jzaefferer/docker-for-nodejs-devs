FROM node:8-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install --silent

COPY . .

CMD npm start
