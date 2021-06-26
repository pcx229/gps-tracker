
## web-app for location tracking  

the site allows the user to view his location on a map, record a route (and from it deduce speed, distance and direction) and save it, sharing saved routes with friends.  
the app uses the browser Geolocation service to obtain the user current location.  
location can also be obtained by a remote device.  
routes are saved locally in the browser cash memory.  
when sharing routes the route data will be sent to the server who will keep it for some time, in that time the route will be available through a link.  

### installation  

```
git clone https://www.github.com/pcx229/gps-tracker.git
cd gps-tracker
cd server; npm install
cd ..
cd client; npm install
```

the next step is to change the app client base and server urls.  
its only required in production, the default values works fine for localhost.  

go to `/client/.env` file and change the values of the following variables to fit your setup:  
*  `REACT_APP_URL` this is your client base url
*  `REACT_APP_REMOTE_GPS_SOCKET_SERVER` and `REACT_APP_SHARE_TRACKING_SERVER` this is your server base url  
alternatively you can set them as environment variables with those names.

server side is using **mongodb** as its database, go to `/server/index.js` and change the database connection string to fit your setup.  
alternatively you can set an environment variable named `MONGO_URL` with your database connection string.  
`note:` the database connection string should include user credentials(if needed) and database name.   

#### https  

https is required on some browsers if access to Geolocation is needed.  

### running in development

```
// in a dedicated terminal
cd server; nodemon

// in a dedicated terminal
cd client; npm start
```

### deploy using docker

```
docker build -t gps-recorder --build-arg APP_BUILD_SERVER_URL={YOUR_WEBSITE_URL} {FOLDER_WHERE_DOCKER_FILE_IS}
docker run -e DB_CONNECTION_STRING={YOUR_MONGODB_SERVER_CONNECTION_STRING} -e PORT=80 -p 80:80 -it --name deployed-gps-recorder gps-recorder
```

### ScreenShot

![tracking app](https://raw.githubusercontent.com/pcx229/gps-tracker/tree/master/screenshot.gif)
