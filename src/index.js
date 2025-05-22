
import express from 'express';;
import mongoose from 'mongoose';
import expense_routes from './routes/expense_routes.js';
import category_routes from './routes/category_routes.js';
import trip_routes from './routes/trip_routes.js'

const app = express()
const port = 3000

// middleware to parse JSON body from the client
app.use(express.json())


// insertion of middleware through respective routes
app.use(trip_routes)
app.use(expense_routes);
app.use(category_routes);

// start the given server on the given port
// the call back called when the server run
// app.listen(port, async () => {
//   console.log(`Example app listening on port ${port}`);
//   // Connect to MongoDB
//   await mongoose.connect('mongodb://127.0.0.1:27017/travelp');
//   console.log(mongoose.connection.readyState ==1 ? 'Mongoose connected' : 'Mongoose failed');

// });

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong on the server' });
});

