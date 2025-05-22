const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const expenseSchema = new Schema({
    amount: {type:  Number, required: true},
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: [true,'category field is required']}, // this is for handling validation error
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: [true,'trip field is required']}, // this is for handling validation error
});

const Expense = model('Expense', expenseSchema);

module.exports = Expense;