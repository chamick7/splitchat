FROM node:13.3.0-alpine

WORKDIR /app
COPY . .


RUN npm install


CMD [ "npm","run","production" ]