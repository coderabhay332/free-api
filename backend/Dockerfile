FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsc


EXPOSE 5000


CMD ["npm", "run", "start"]
