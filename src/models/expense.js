import { model } from 'mongoose';

const Category = model('Expense', {
    amount: {type:  Number, required: true},
    description: { type: String, required: true }
});

export default Category;