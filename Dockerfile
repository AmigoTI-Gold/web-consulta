FROM node:12-alpine

WORKDIR /usr/src/app

EXPOSE 3333

CMD npm run typeorm migration:run && npm start
