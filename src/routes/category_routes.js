
const express = require('express');
const Category = require('../models/category');
const router = express.Router();
const { verifyToken } = require('../auth.js');
const { badRequest, notFound, serverError, forbidden } = require('../utils/responses.js');



router.use(verifyToken);

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

//get all category
router.get('/categories', async(req, res) => {
    try {
        const userId = req.auth._id;
        const categories = await Category.find({ user: userId });
        const formattedCatrgories = categories.map(formatCategory);
        res.send(formattedCatrgories);
    } catch {
        serverError(res,'Failed to get categories');
    }
});

//Get one category
router.get('/categories/:id', async(req, res) => {
    try {
        const category = await checkCategoryOwnership(req.params.id, req.auth._id);
        res.send(formatCategory(category));
    } catch (err){
        if (err.status === 404) return notFound(res, err.message);
        if (err.status === 403) return forbidden(res, err.message);
        badRequest(res, 'Invalid expense ID format');
        // badRequest(res, err.message || 'Invalid category ID format');
    }
});

// Create category
router.post('/categories', async(req,res) => {
    try {
        const userId = req.auth._id; // Get the user ID from the JWT token
        // frontend submit a name, and get back a valid category — either newly created or already existing.
        const name = req.body.name?.trim().toLowerCase(); // trim: string method that removes whitespace from both the beginning and end of a string.

        if (!name) {
            return badRequest(res, 'Category name is required');
        }

        await checkNameUnique(name, userId);

        // Create and save new category
        const category = await Category.create({ name, user: userId });
        res.status(201).send(formatCategory(category));
    }
    catch (err) {
        if (err.status === 400) return badRequest(res, err.message);
        serverError(res, err.message || 'Failed to create category');
    }
});

// Update 
router.put('/categories/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const userId = req.auth._id;
        const newName = req.body.name?.trim().toLowerCase();

        if (!newName) return badRequest(res, 'Category name is required');

        await checkCategoryOwnership(categoryId, userId);
        await checkNameUnique(newName, userId, categoryId);

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name: newName },
            { new: true,
                runValidators: true,
                context: 'query',
            }
        );

         res.send(formatCategory(updatedCategory));

    } catch (err) {
        if (err.status === 404) return notFound(res, err.message);
        if (err.status === 403) return forbidden(res, err.message);
        if (err.status === 400) return badRequest(res, err.message);
        serverError(res, err.message || 'Failed to update category');
    }
});


// Delete 
router.delete('/categories/:id', async (req, res) => {
    try {
        const userId = req.auth._id;
        const deleted = await Category.findOneAndDelete({
            _id: req.params.id,
            user: userId
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