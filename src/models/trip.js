/* Creates a trip model for the database with the following fields:
location, arrivalDate, departureDate, totalExpense */
//import { model, ObjectId } from 'mongoose'
const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const Trip = model('Trip', {
  location: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  departureDate: { type: Date, required: true },
  //totalExpense: { type: ObjectId, ref: 'Expense', required: true }
  // totalExpense: { type: Schema.Types.ObjectId, ref: 'Expense', required: true }
  totalExpense: { type: Number, default: 0 }
  /* THIS KEY SHOULD BE IMPORTED FROM THE ENTITY 'Expense' WHERE
  A KEY 'totalExpense' CAN BE DEFINED TO STORE THE SUM OF ALL THE
  EXPENSES DURING THIS 'trip'*/
})

module.exports = Trip 
// export default Trip
