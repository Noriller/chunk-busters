FROM node:22-alpine

COPY ./facade.mjs /server/facade.mjs

CMD node /server/facade.mjs
