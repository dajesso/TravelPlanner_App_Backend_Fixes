const express = require('express');
const Trip = require('../models/trip');
const Expense = require('../models/expense'); 

const router = express.Router();

// Trip Routes

// Get all trips
//TODO: auth
router.get('/trips', async (req, res) => {
  res.send(await Trip.find());
})

// Get one trip
//TODO: auth

// relative HTTP route to retrieve the trip
router.get('/trips/:id', async (req, res) => {
  // get the ID from the trip
  const tripId = req.params.id;
  // get the trip with the given ID
  const trip = await Trip.findOne({ _id: tripId }); // Angie fixed it (24.05.25)--- HERE THIS PART WAS COMPLEMENTED BY .populate('category') FOR THE nodeintro example.
  // send the trip back to the client
  if (trip) {
    res.send(trip)
    // return an meaningful message to the client in case of error
  } else {
    res.status(404).send({ error: `Trip with id ${tripId} not found`})
  }
})

// Create a new trip
//TODO: auth

router.post('/trips', async (req, res) => {
  try {
    // get trip data from the request body
    const bodyData = req.body
    // create and save the new Trip instance
    const trip = await Trip.create(bodyData)
    // send trip to the client with 201 status
    res.status(201).send(trip)
  }
  catch (err) {
    // TODO: log to error file
    res.status(400).send({ error: err.message })
  }
})


// Update a trip
//TODO: auth

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
//TODO: auth

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


const updateTripTotalExpense = async (tripId) => {

  const total = await Expense.getTotalForTrip(tripId);
  await Trip.findByIdAndUpdate(tripId, { totalExpense: total });
};

// imports the whole module
module.exports =  router;
