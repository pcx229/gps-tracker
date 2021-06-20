FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# environment variables
ENV PORT=80

# required for build
ARG APP_BUILD_SERVER_URL

ENV REACT_APP_URL=$APP_BUILD_SERVER_URL
ENV REACT_APP_REMOTE_GPS_SOCKET_SERVER=$APP_BUILD_SERVER_URL
ENV REACT_APP_SHARE_TRACKING_SERVER=$APP_BUILD_SERVER_URL

#ENV MONGO_URL=

ENV NODE_ENV=production

# server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./server/package*.json ./

# Building dependencies for production
RUN npm ci --only=production

# Bundle app source
COPY ./server/ .

# client

# Move to temp directory to build client app
WORKDIR temp

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./client/package*.json ./

# Building dependencies for production
RUN npm ci --only=production

# Bundle app source
COPY ./client/ .

# remove enviorment variables
RUN rm .env

# build app for production
RUN npm run build

# Move client build to server public directory
RUN mkdir -p ../public
RUN cp -r build/* ../public

# Move back to app directory
WORKDIR ..

# Remove client development folder
RUN rm -r temp

EXPOSE 80
CMD [ "node", "index.js" ]
