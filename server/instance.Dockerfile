FROM node:22-alpine

COPY ./instance.mjs /server/instance.mjs

CMD node /server/instance.mjs
