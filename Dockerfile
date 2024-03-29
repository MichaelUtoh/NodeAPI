FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 9000
CMD [ "yarn", "start" ]