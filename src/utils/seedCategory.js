const Category = require('../models/category');
// State the fixed 6 categories
const fixedCategories = ['Food', 'Transport', 'Accommodation', 'Activities', 'Shopping', 'Other'];

async function seedCategoriesForUser(userId) {
  const operations = fixedCategories.map(name => ({
    updateOne: {
      filter: { name, user: userId },
      update: { name, user: userId },
      upsert: true // only inserts if it doesn’t exist
    }
  }));
  await Category.bulkWrite(operations);
}


module.exports = { seedCategoriesForUser};