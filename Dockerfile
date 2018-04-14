FROM node:alpine
ENV PORT=8080 \
    MONGODB_URI=mongodb://heroku_lk943l2m:8j3m87o3ojnma9031nr05hgpqk@ds127129.mlab.com:27129/heroku_lk943l2m \
    JWT_SECRET=Pdppaw903131ldaaalflpaedadkadadaddadaweewwrrgg \
    NODE_ENV=prod
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD npm start
EXPOSE 8080