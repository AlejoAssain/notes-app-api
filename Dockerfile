# Add these enviroment variables when running the container
#   ATLAS_URI
#   JWT_SECRET

FROM node:16-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm ci --production

EXPOSE 80

CMD ["node", "index.js"]
