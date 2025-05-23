
// import { connect } from './db.js'
// import { connect } from 'mongoose';
// import mongoose from 'mongoose';
// import expense_routes from './routes/expense_routes.js';
// import category_routes from './routes/category_routes.js';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expense_routes = require('./routes/expense_routes.js');
const category_routes = require('./routes/category_routes.js');
const trip_routes = require('./routes/trip_routes.js');
const auth_routes = require('./routes/auth_routes.js');
const connect = require('./db.js')


const app = express ()
const port = 3000

// middleware to parse JSON body from the client
app.use(express.json())


// insertion of middleware through respective routes
app.use(auth_routes)
app.use(trip_routes)
app.use(expense_routes);
app.use(category_routes);

// start the given server on the given port

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  connect()
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong on the server' });
});
