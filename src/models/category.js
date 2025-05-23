const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const categorySchema = new Schema({
    name: { type: String, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// to make category must be unique for each user, e.g. one user cannot have two food category
categorySchema.index({ name: 1, user: 1 }, { unique: true });

const Category = model('Category', categorySchema);

module.exports = Category;