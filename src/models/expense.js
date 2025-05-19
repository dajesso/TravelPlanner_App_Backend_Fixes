import { model, Schema } from 'mongoose';

const expenseSchema = new Schema({
    amount: {type:  Number, required: true},
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true }
});

expenseSchema.statics.getTotalForTrip = async function(tripId) {
//  Use MongoDB's aggregation to calculate the total
  const result = await this.aggregate([
    // Find all expenses where the "trip" field matches the tripID
    { $match: { trip: tripId } },
    //Group all these matching expenses together (we use _id: null because we want to group all)
    // and sum up their "amount" fields, storing it as "total"
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  // If no expenses are found, result[0] will be undefined, so return 0 instead
  return result[0]?.total || 0;
};

const Expense = model('Expense', expenseSchema);
export default Expense;