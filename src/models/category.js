const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true }
});

const Category = model('Category', categorySchema);

export default Category;