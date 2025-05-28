
const express = require('express');
const Category = require('../models/category');
const router = express.Router();
const { verifyToken } = require('../auth.js');
const { badRequest, notFound, serverError } = require('../utils/responses.js');



router.use(verifyToken);

// Capitalize helper
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//get all category
router.get('/categories', async(req, res) => {
    try {
        const userId = req.auth._id;
        const categories = await Category.find({ user: userId });

        const formattedCatrgories = categories.map(cat => ({
        ...cat.toObject(),
        name: capitalizeFirstLetter(cat.name)
        }));

        res.send(formattedCatrgories);

    } catch {
        serverError(res,'Failed to get categories');
    }
});

//Get one category
router.get('/categories/:id', async(req, res) => {
    try {
        // Get the id
        const category_id = req.params.id; // string

        const category = await Category.findById(category_id);

        //send the post back to the client
        if (category) {
            const result = category.toObject();
            result.name = capitalizeFirstLetter(result.name);
            res.send(result);
        } else{
            notFound(res, `Category with id ${category_id} not found`);
        }
    } catch {
        badRequest(res, 'Invalid expense ID format');
    }
});

// Create category
router.post('/categories', async(req,res) => {
    try {
        const userId = req.auth._id; // Get the user ID from the JWT token

        // Get data from the request body abd check if the name is unique
        // const bodyData = req.body;
        // const exists = await Category.findOne({ name: req.body.name });

        // frontend submit a name, and get back a valid category — either newly created or already existing.
        const name = req.body.name?.trim().toLowerCase(); // trim: string method that removes whitespace from both the beginning and end of a string.


        if (!name) {
            return badRequest(res, 'Category name is required');
        }

        const existing = await Category.findOne({ name, user: userId});

        // if the category name already exists
        if (existing) {
            return badRequest(res, 'The category already exists');
        }
        // Create and save new category
        const category = await Category.create({ name, user: userId });
        const result = category.toObject();
        result.name = capitalizeFirstLetter(result.name);
        return res.status(201).send(category);
    }
    catch (err) {
        badRequest(res, err.message);
    }
});

// Update 
router.put('/categories/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const userId = req.auth._id;
        const newName = req.body.name?.trim().toLowerCase();

        // 🔒 Check ownership first
        const category = await Category.findById(categoryId);
        if (!category) {
        return notFound(res, `Category with id ${categoryId} not found`);
        }

        if (category.user.toString() !== userId.toString()) {
        return res.status(403).send({ error: 'Forbidden' }); // Not your category
        }

        if (!newName) {
            return badRequest(res, 'Category name is required')};
        
        // Check if another category with the same name exists
        const exists = await Category.findOne({ name: newName, user: req.auth._id, _id: { $ne: categoryId } });
        if (exists) {
            return badRequest(res, 'Category name already exists')};

        const updatedCategory = await Category.findOneAndUpdate(
        { _id: categoryId, user: userId },
        { name: newName },
        { new: true,
            runValidators: true,
            context: 'query',
        }
        );

        if (!updatedCategory) {
            return notFound(res, `Category with id ${req.params.id} not found`);
        }
        const result = updatedCategory.toObject();
        result.name = capitalizeFirstLetter(result.name);
        res.send(result);
    } catch (err) {
        badRequest(res, err.message);
    }
});


// Delete 
router.delete('/categories/:id', async (req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({
            _id: req.params.id,
            user: req.auth._id
        });

        if (deleted) {
            res.send({ message: `Category '${deleted.name}' deleted.` });
        } else {
            notFound(res, `Category with id ${req.params.id} not found`);
        }
    } catch {
        badRequest(res, 'Invalid category ID format');
    }
});


module.exports = router;