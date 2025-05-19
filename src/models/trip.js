/* Creates a trip model for the database with the following fields:
location, arrivalDate, departureDate, totalExpense */
import { model, ObjectId } from 'mongoose'

const Trip = model('Trip', {
  location: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  departureDate: { type: Date, required: true },
  totalExpense: { type: ObjectId, ref: 'Expense', required: true }
  /* THIS KEY SHOULD BE IMPORTED FROM THE ENTITY 'Expense' WHERE
  A KEY 'totalExpense' CAN BE DEFINED TO STORE THE SUM OF ALL THE
  EXPENSES DURING THIS 'trip'*/
})

module.exports = { Trip }
