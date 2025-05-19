import express from 'express'
import mongoose from 'mongoose'
import trip_routes from './routes/trip_routes.js'

const app = express()
const port = 3000

// middleware to parse JSON body from the client
app.use(express.json())


// insertion of middleware through respective routes
app.use(trip_routes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`) 
  // Connect to MongoDB
  mongoose.connect('mongodb://127.0.0.1:27017/latte_dB')
  console.log(mongoose.connection)
})