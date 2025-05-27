
const express = require('express');
const Category = require('../models/category');
const router = express.Router();
const { verifyToken } = require('../auth.js');
const { badRequest, notFound, serverError, forbidden } = require('../utils/responses.js');



router.use(verifyToken);

// Middleware to extract userId for easier access
function extractUserId(req, res, next) {
  req.userId = req.auth._id;
  next();
}
router.use(extractUserId);

// Capitalize helper
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Format category for responses
function formatCategory(category) {
  const obj = category.toObject();
  obj.name = capitalizeFirstLetter(obj.name);
  return obj;
}

// Middleware to validate and clean category name input
function validateCategoryName(req, res, next) {
  const name = req.body.name?.trim().toLowerCase();
  if (!name) return badRequest(res, 'Category name is required');
  req.cleanedCategoryName = name;
  next();
}

// Unified response sender for single or multiple categories
function sendCategoryOrCategories(res, data) {
  if (Array.isArray(data)) {
    return res.send(data.map(formatCategory));
  }
  return res.send(formatCategory(data));
}

// Check category exist and ownership
async function checkCategoryOwnership(categoryId, userId) {
  const category = await Category.findById(categoryId);
  if (!category) throw { status: 404, message: `Category with id ${categoryId} not found` };
  if (category.user.toString() !== userId.toString()) throw { status: 403, message: 'Forbidden' };
  return category;
}

// Check category name uniqueness
async function checkNameUnique(name, userId, excludeId = null) {
  const query = { name, user: userId };
  if (excludeId) query._id = { $ne: excludeId };
  const exists = await Category.findOne(query);
  if (exists) throw { status: 400, message: 'Category name already exists' };
}

// Error handler helper
function handleError(res, err, defaultMessage) {
  if (err.status === 404) return notFound(res, err.message);
  if (err.status === 403) return forbidden(res, err.message);
  if (err.status === 400) return badRequest(res, err.message);
  return serverError(res, err.message || defaultMessage);
}

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
        await checkCategoryOwnership(req,params.id, req.userId);
        await checkNameUnique(req.cleanedCategoryName, req.userId, req.params.id);

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name: req.cleanedCategoryName },
            { new: true,
                runValidators: true,
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
    } catch {
        badRequest(res, 'Invalid category ID format');
    }
});


module.exports = router;