import express from 'express';
import trip_routes from './routes/trip_routes.js'
import { connect } from './db.js'
// import { connect } from 'mongoose';
// import mongoose from 'mongoose';
// import expense_routes from './routes/expense_routes.js';
// import category_routes from './routes/category_routes.js';


const app = express ()
const port = 3000

// middleware to parse JSON body from the client
app.use(express.json())


// insertion of middleware through respective routes
app.use(trip_routes)
// app.use(expense_routes);
// app.use(category_routes);

// start the given server on the given port
// the call back called when the server run



app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  connect()
});

