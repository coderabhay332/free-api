FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./


RUN npm install


COPY . .


RUN npm run start


EXPOSE 5000


CMD ["node", "dist/index.js"]