
const express = require('express');
const Category = require('../models/category');
const router = express.Router();
const { verifyToken } = require('../auth.js');
const { badRequest, notFound, serverError } = require('../utils/responses.js');


router.use(verifyToken);

//get all category
router.get('/categories', async(req, res) => {
    try {
        const userId = req.auth._id;
        const categories = await Category.find({ user: userId });
        res.send(categories);
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
            res.send(category);
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
        const name = req.body.name?.trim(); // trim: string method that removes whitespace from both the beginning and end of a string.


        if (!name) {
            return badRequest(res, 'Category name is required');
        }

        const existing = await Category.findOne({ name, user: userId});

        // if the category name already exists
        if (existing) {
            return badRequest(res, 'Please use existed Categories');
        }
        // Create and save new category
        const category = await Category.create({ name, user: userId });
        return res.status(201).send(category);
    }
    catch (err) {
        badRequest(res, err.message);
    }
});

// Update 
router.put('/categories/:id', async (req, res) => {
    try {
        // to make sure the name does not exist
        const exists = await Category.findOne({ name: req.body.name });
        if (exists) {
            notFound(res, 'Category name already exists');
        };
        // proceed with update
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'});
        if (category) {
            res.send(category);
        } else {
            notFound(res, `Category with id ${category_id} not found`);
        }
    } catch (err){
        badRequest(res, err.message);
    }
});


// Delete 
router.delete('/categories/:id', async (req, res) => {
    try{
        const category = await Category.findByIdAndDelete(req.params.id);
        if (category) {
            res.send({ message: `Category '${category.name}' has been deleted.` });
        } else {
            notFound(res, `Category with id ${category_id} not found`);
        }
    } catch {
        badRequest(res, 'Invalid expense ID format');
    }
});


module.exports = router;