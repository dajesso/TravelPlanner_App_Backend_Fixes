import express from 'express'
import mongoose from 'mongoose'
import category_routes from './routes/category_routes.js'


const app = express()
const port = 3000
// insert middleware to insert json body
app.use(express.json())
// app.use inserts middleware into the request-reponse cycle
app.use(category_routes)

// start the given server on the given port
// the call back called when the server run
app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  // Connect to MongoDB
  await mongoose.connect('mongodb://127.0.0.1:27017/travelplanner')
  console.log(mongoose.connection.readyState ==1 ? 'Mongoose connected' : 'Mongoose failed')

})