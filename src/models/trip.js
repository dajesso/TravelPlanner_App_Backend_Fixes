/**
 * Creates a trip Schema for the database with the following fields:
 * location, arrivalDate, departureDate, totalExpense 
 */

import { model, Schema } from 'mongoose';

const tripSchema =  new Schema({
  location: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  departureDate: { type: Date, required: true },
  totalExpense: { type: Number, default: 0 }
  /* THIS KEY SHOULD BE IMPORTED FROM THE ENTITY 'Expense' WHERE
  A KEY 'totalExpense' CAN BE DEFINED TO STORE THE SUM OF ALL THE
  EXPENSES DURING THIS 'trip'*/
})

const Trip = model('Trip', tripSchema);
export default Trip;
// module.exports = { Trip }