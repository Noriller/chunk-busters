FROM node:22.7-alpine AS builder

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./prod/nginx.conf /etc/nginx/conf.d/default.conf
