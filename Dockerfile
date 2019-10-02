FROM node:lts-alpine
WORKDIR /app/dist
ADD dist .
WORKDIR /app/node_modules
ADD node_modules .
WORKDIR /app
ADD package.json .
# RUN npm install 
RUN mkdir uploads
RUN mkdir uploads/cv
RUN mkdir uploads/pictures
CMD node dist/server.js