/**
 * Creates a trip Schema for the database with the following fields:
 * location, arrivalDate, departureDate, totalExpense 
*/
const User = require('./user.js')
const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const tripSchema =  new Schema({
  location: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  departureDate: { type: Date, required: true },
  totalExpense: { type: Number, default: 0 },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  }
})  
  
const Trip = model('Trip', tripSchema);


module.exports = Trip 


