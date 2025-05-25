const express = require('express');
const Trip = require('../models/trip');
const Expense = require('../models/expense'); 
// const User = require('../models/user.js')
const router = express.Router();
const { verifyToken } = require('../auth.js'); 
const { badRequest, notFound, serverError } = require('../utils/responses.js');

// Protect all routes in this router
router.use(verifyToken);


// TRIP ROUTES

// Get all trips
router.get('/trips', async (req, res) => {
  try {
    // 1. verify email of user making the request
    const user = req.auth;
    // 2. return badRequest if the user is not authenticated
    if(!user || !user.email) {
      return badRequest(res, 'User not authorized');
    }
    // 3. find all the trips where the user is the owner and return them
    const trips = await Trip.find({ userId: req.auth._id });
    return res.json(trips);

  } catch(err) {
    console.error(err);
    serverError(res, 'Failed to get trips');
  }
})


// Get one trip
// relative HTTP route to retrieve the trip
router.get('/trips/:id', async (req, res) => {
  // get the ID from the trip
  const tripId = req.params.id;
  // get the trip with the given ID
  const trip = await Trip.findOne({ _id: tripId }); 
  // send the trip back to the client
  if (trip) {
    res.send(trip)
    // return an meaningful message to the client in case of error
  } else {
    res.status(404).send({ error: `Trip with id ${tripId} not found`})
  }
})


// Create a new trip
router.post('/trips', async (req, res) => {
  try {
      // Create a new trip linked to the user by userId
      const trip = await Trip.create({
        location: req.body.location,
        arrivalDate: req.body.arrivalDate,
        departureDate: req.body.departureDate,
        userId: req.auth._id // This field links the user to the trip
      })
    res.status(201).send(trip)
  }
  catch (err) {
    // TODO: log to error file
    res.status(400).send({ error: err.message })
  }
})


// Update a trip
async function update(req, res) {
  // retrieve the trip from the database
  const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' })
  if (trip) {
    // send the trip the client
    res.send(trip)
    // return an meaningful message to the client in case of error
  } else {
    res.status(404).send({ error: `Trip with id = '${req.params.id}' not found` })
  }
}

router.put('/trips/:id', update)
router.patch('/trips/:id', update)


// Delete a trip
router.delete('/trips/:id', async (req, res) => {
  const trip = await Trip.findByIdAndDelete(req.params.id)
  if (trip) {
    // sent the trip to the client
    res.send(trip)
    // return an meaningful message to the client in case of error
  } else {
    res.status(404).send({ error: `Trip with id = '${req.params.id}' not found` })
  }
})

// Update the totalExpense of one trip
const updateTripTotalExpense = async (tripId) => {
  const total = await Expense.getTotalForTrip(tripId);
  await Trip.findByIdAndUpdate(tripId, { totalExpense: total });
};

// imports the whole module
module.exports =  router;
