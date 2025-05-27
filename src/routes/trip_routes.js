const express = require('express');
const Trip = require('../models/trip');
const Expense = require('../models/expense'); 
const moment = require('moment');
const { validateTripUpdate, validateNewTrip, parseDate } = require('../utils/validateTrip.js')
const router = express.Router();
const { verifyToken } = require('../auth.js'); 
const { badRequest, notFound, serverError } = require('../utils/responses.js');

// Protect all routes in this router
router.use(verifyToken);

//formatting date output
function formatTrip(trip) {
  return {
    _id: trip._id,
    location: trip.location,
    arrivalDate: moment(trip.arrivalDate).format('DD/MM/YYYY'),
    departureDate: moment(trip.departureDate).format('DD/MM/YYYY'),
    totalExpense: trip.totalExpense,
    userId: trip.userId
  };
}

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
    // formatting the output
    const formattedTrips = trips.map(formatTrip);
    return res.json(formattedTrips);

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
    res.send(formatTrip(trip));
    // return an meaningful message to the client in case of error
  } else {
    res.status(404).send({ error: `Trip with id ${tripId} not found`})
  }
})


// Create a new trip
router.post('/trips', async (req, res) => {
  try {
    const validatedData = validateNewTrip(req.body);

    const trip = await Trip.create({
      ...validatedData,
      userId: req.auth._id,
    });

    res.status(201).send(trip);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});


// Update a trip
router.patch('/trips/:id', async (req, res) => {
  try {
    const existingTrip = await Trip.findById(req.params.id);
    if (!existingTrip) {
      return res.status(404).send({ error: 'Trip not found' });
    }

    const updateFields = validateTripUpdate(req.body, existingTrip);

    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, updateFields, {
      returnDocument: 'after',
    });

    res.send(updatedTrip);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});




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
