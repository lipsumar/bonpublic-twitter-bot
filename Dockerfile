FROM node:12.14
WORKDIR /usr/src/app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
CMD ["npm", "start"]
