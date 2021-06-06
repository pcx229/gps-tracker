
## web-app for location tracking  

the site allows the user to view his location on a map, record a route (and from it deduce speed, distance and direction) and save it, sharing saved routes with friends.  
the app uses the browser Geolocation service to obtain the user current location.  
location can also be obtained by a remote device.  
routes are saved locally in the browser cash memory.  
when sharing routes the route data will be sent to the server who will keep it for some time, in that time the route will be available through a link.  

### Installation  

```
git clone https://www.github.com/pcx229/gps-tracker.git
cd gps-tracker
cd server; npm install
cd ..
cd client; npm install
```

the next step is to change the app client base and server urls.  
go to `/client/.env` file and change the values of the following variables:  
*  **REACT_APP_URL** this is your client base url
*  **REACT_APP_REMOTE_GPS_SOCKET_SERVER** and **REACT_APP_SHARE_TRACKING_SERVER** this is your server base url

#### Https  

you may want to create your own ssl keys to use in your setup if you are thinking on publishing it.  
you can generate a key using this script on linux with openssl installed `./server/ssl/commands.sh`  
**https** is required on some browsers if access to Geolocation is needed.  

### Running

```
// in a dedicated terminal
cd server; nodemon

// in a dedicated terminal
cd client; npm start
```

### ScreenShot

![tracking app](https://www.github.com/pcx229/gps-tracker/tree/master/screenshot.gif)