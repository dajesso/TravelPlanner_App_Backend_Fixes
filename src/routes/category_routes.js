
const express = require('express');
const Category = require('../models/category');
const router = express.Router();
const { verifyToken } = require('../auth.js');
const { badRequest, notFound } = require('../utils/responses.js');
const { handleError } = require('../utils/helpers.js');


// Protect all category routes with JWT token verification
router.use(verifyToken);

// Helpers ------

// Extracts user ID from the token and attaches it to the request object
function extractUserId(req, res, next) {
  // Store the user's ID from the decoded token (auth middleware) onto the request
  req.userId = req.auth._id;
  // Continue 
  next();
}
// Apply this middleware globally to all routes in this router
router.use(extractUserId);


// Utility: Capitalizes the first letter of a string (used for display formatting)
function capitalizeFirstLetter(string) {
  /** Get the first charachter,
   * make it uppercase,
   * add the rest of the string.
   * string.slice(1) returns a copy of the original string, starting from index 1 to the end.
   */
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Formats a category by capitalizing its name before sending to the client
function formatCategory(category) {
  // Convert Mongoose document to plain object
  const obj = category.toObject();
  // Capitalize the first letter of the name
  obj.name = capitalizeFirstLetter(obj.name);
  return obj;
}

// Middleware to clean and validate the 'name' field for categories
function validateCategoryName(req, res, next) {
  // Access name, remove extra spaces, convert to lowercase
  const name = req.body.name?.trim().toLowerCase();
  // If name is empty or missing, return a 400 error
  if (!name) return badRequest(res, 'Category name is required');
  // Store cleaned name on request object for later use
  req.cleanedCategoryName = name;
  next();
}

// Sends a single category or list of categories after formatting
function sendCategoryOrCategories(res, data) {
  // If the data is a list of categories
  if (Array.isArray(data)) {
      // Format each category and send the list
      return res.send(data.map(formatCategory));
 }
  // If it's a single category, format and send it
  return res.send(formatCategory(data));
}

// Checks if a category exists and if it belongs to the requesting user
async function checkCategoryOwnership(categoryId, userId) {
  // Find the category by its ID
  const category = await Category.findById(categoryId);
  // If not found, throw a 404 error
  if (!category) throw { status: 404, message: `Category with id ${categoryId} not found` };

  // If it exists but belongs to another user, throw a 403
  if (category.user.toString() !== userId.toString()) throw { status: 403, message: 'Forbidden' };
  return category;
}

// Ensures the category name is unique for the given user, with optional exclusion for updates
async function checkNameUnique(name, userId, excludeId = null) {
  // Build query to find category with the same name by this user
  const query = { name, user: userId };
  // If updating, ignore the current category using $ne (not equal)
  if (excludeId) query._id = { $ne: excludeId };
  // Look for any existing matching category
  const exists = await Category.findOne(query);
  if (exists) throw { status: 400, message: 'Category name already exists' };
}


// Routed Handles -------
//get all category
router.get('/categories', async(req, res) => {
  try {
    const categories = await Category.find({ user: req.userId });
    sendCategoryOrCategories(res, categories);
  } catch (err) {
    handleError(res,err, 'Failed to get categories');
  }
});

//Get one category
router.get('/categories/:id', async(req, res) => {
  try {
    const category = await checkCategoryOwnership(req.params.id, req.auth._id);
    sendCategoryOrCategories(res, category);
  } catch (err){
    handleError(res,err, 'Invalid category ID format')
  }
});

// Create category
router.post('/categories', validateCategoryName, async(req,res) => {
  try {
    await checkNameUnique(req.cleanedCategoryName, req.userId);
    
    // Create and save new category
    const category = await Category.create({ name: req.cleanedCategoryName, user: req.userId });
    res.status(201).send(formatCategory(category));
  }
  catch (err) {
    handleError(res, err, 'Failed to create category');
  }
});

// Update 
router.put('/categories/:id', validateCategoryName, async (req, res) => {
  try {
    await checkCategoryOwnership(req.params.id, req.userId);
    await checkNameUnique(req.cleanedCategoryName, req.userId, req.params.id);

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      // Updated data
      { name: req.cleanedCategoryName },
      // Return the updated document instead of the old one
      { new: true,
      // Run Mongoose schema validation rules
      runValidators: true,
      // Required for some validators (like unique) to behave correctly
      context: 'query',
  }
    );

  sendCategoryOrCategories(res, updatedCategory);

  } catch (err) {
    handleError(res, err, 'Failed to update category');
  }
});


// Delete 
router.delete('/categories/:id', async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (deleted) {
      res.send({ message: `Category '${capitalizeFirstLetter(deleted.name)}' deleted.` });
    } else {
      notFound(res, `Category with id ${req.params.id} not found`);
    }
  } catch (err){
    handleError(res, err, 'Invalid category ID format');
  }
});


module.exports = router;