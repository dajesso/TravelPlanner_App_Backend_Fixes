import { model, Schema } from 'mongoose';

const expenseSchema = new Schema({
    amount: {type:  Number, required: true},
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
});

const Expense = model('Expense', expenseSchema);
export default Expense;