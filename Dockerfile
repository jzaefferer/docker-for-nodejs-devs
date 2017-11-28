FROM node:8-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json /usr/src/app/
RUN npm install --silent

COPY . .

CMD npm start
