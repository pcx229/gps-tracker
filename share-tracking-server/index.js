
const express = require('express')
const app = express()
const port = 3004
const cors = require('cors');

const fs = require('fs');
const httpsServer = require("https").createServer({
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
}, app)

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/gps_tracking', {useNewUrlParser: true, useUnifiedTopology: true})

var sha1 = require('sha1')
const Share = require('./shareSchema')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(cors())
app.use(express.json());

// routes

app.get('/share-tracking/all', async (req, res) => {
  // get all existing tracking
  let found = await Share.find().exec()
  if(!found) {
    found = []
  }
  console.log("there are " + found.length + " tracking record total")
  res.status(200)
  res.send(found)
})

app.get('/share-tracking', async (req, res) => {
  // search for the wanted tracking
  const tracking_hash = req.query.hash
  const found = await Share.findOne({ hash: tracking_hash }).exec()
  if(found) {
    console.log("found tracking [" + tracking_hash + "]")
    res.status(200)
    res.send(found.tracking)
  } else {
    console.log("tracking not found [" + tracking_hash + "]")
    res.sendStatus(404)
  }
})

app.post('/share-tracking', async (req, res) => {
  const tracking_hash = sha1(JSON.stringify(req.body));
  // check if tracking exist already
  const found = await Share.findOne({ hash: tracking_hash }).exec()
  if(!found) {
    console.log("new tracking inserted to database [" + tracking_hash + "]")
    // insert the tracking to the database
    const entry = new Share({ hash: tracking_hash, tracking: req.body })
    await entry.save()
  }
  res.status(200)
  res.send(tracking_hash)
})

// remove saved tracking after a certin time

const EXPIRE_SAVE_TRACKING_TIME = 7*24*60*60*1000
async function remove_expired_saved_tracking() {
  console.log("clearing expired saved tracking")
  // remove expired tracking from database
  const cutoff = Date.now() - EXPIRE_SAVE_TRACKING_TIME
  await Share.deleteMany({date:{$lt:cutoff}})
  // check again later
  setTimeout(remove_expired_saved_tracking, EXPIRE_SAVE_TRACKING_TIME);
}
remove_expired_saved_tracking()

httpsServer.listen(port, () => {
    console.log(`listening on port ${port}`)
});