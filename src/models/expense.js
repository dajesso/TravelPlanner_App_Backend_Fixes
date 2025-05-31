
const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const expenseSchema = new Schema({
  amount: {type:  Number, required: [true, 'Amount is required']},
  description: { type: String, required: [true, 'Description is required']},
  // this is for handling validation error
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: [true,'category field is required']}, 
  // this is for handling validation error
  trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: [true,'trip field is required']}, 
});

// Total expenses
expenseSchema.statics.getTotalForTrip = async function(tripId) {
// Use MongoDB's aggregation to calculate the total
  const result = await this.aggregate([
    // Find all expenses where the "trip" field matches the tripID
    { $match: { trip: tripId } },
    /**
     * Group all these matching expenses together 
     * (we use _id: null because we want to group all)
     * and sum up their "amount" fields, storing it as "total"
     */
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  // If no expenses are found, result[0] will be undefined, so return 0 instead
  return result[0]?.total || 0;
};

const Expense = model('Expense', expenseSchema);
module.exports = Expense;

