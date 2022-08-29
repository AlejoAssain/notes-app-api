# Add these enviroment variables when running the container
#   ATLAS_URI
#   JWT_SECRET

FROM node:16-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 4000

CMD ["node", "index.js"]
