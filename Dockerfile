FROM node:8-alpine

WORKDIR /opt/app

COPY package.json package-lock.json /opt/app/
RUN npm install --silent

COPY . .

CMD npm run dev
