FROM node:lts-alpine
WORKDIR /app
ADD . .
# WORKDIR /app/node_modules
# ADD node_modules .
# WORKDIR /app
# ADD package.json .
# RUN npm install 
ADD ./mongo-tls ./dist
CMD node dist/main.js