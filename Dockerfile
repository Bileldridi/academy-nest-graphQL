FROM node:lts-alpine
WORKDIR /app/dist
ADD dist .
WORKDIR /app/node_modules
ADD node_modules .
WORKDIR /app
ADD package.json .
# RUN npm install 
CMD node dist/main.js