ARG APP_NAME

FROM node:12-slim as module
WORKDIR /app
COPY ./package.json .
RUN npm install --production

FROM mhart/alpine-node:slim-12
WORKDIR /app
ARG TZ=Asia/Bangkok
RUN apk add --no-cache tzdata
RUN ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone
COPY ./app .
COPY ./package.json ../package.json
COPY --from=module /app/node_modules ./node_modules
RUN ls -lt
EXPOSE 3000
CMD node ./server.js
