
const express = require('express');
const Category = require('../models/category');
const router = express.Router();
const { badRequest, notFound, serverError } = require('../utils/responses.js');


//get all category
router.get('/categories', async(req, res) => {
    try {
        const categories = await Category.find();
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
        // Get data from the request body abd check if the name is unique
        const bodyData = req.body;
        const exists = await Category.findOne({ name: req.body.name });
        // if the category name already exists
        if (exists) {
            notFound(res, 'Category name already exists');
        }
        // Create and save new category
        const category = await Category.create(bodyData);
        // Send post to the client with 201 status
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