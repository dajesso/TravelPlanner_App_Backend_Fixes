
import { Router } from 'express';
import Category from '../models/category.js';

const router = Router();

//get all category
router.get('/categories', async(req, res) => {
    const categories = await Category.find();
    res.send(categories);
});

//Get one category
router.get('/categories/:id', async(req, res) => {
    // Get the id
    const category_id = req.params.id; // string

    const category = await Category.findById(category_id);

    //send the post back to the client
    if (category) {
        res.send(category);
    } else{
        res.status(404).send ({error:`Category with id ${category_id} not found`});
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
        return res.status(400).send({ error: 'Category name already exists' });
        }
        // Create and save new category
        const category = await Category.create(bodyData);
        // Send post to the client with 201 status
        return res.status(201).send(category);
    }
    catch (err) {
        // TODO: Log to error file
        return res.status(400).send({ error: err.message });
    }
});

// Update 
router.put('/categories/:id', async (req, res) => {
    try {
        // to make sure the name does not exist
        const exists = await Category.findOne({ name: req.body.name });
        if (exists) {
        return res.status(400).send({ error: 'Category name already exists' });
        };
        // proceed with update
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'});
        if (category) {
            res.send(category);
        } else {
            res.status(404).send({ error: `Category with id = '${req.params.id}' not found` });
        }
    } catch (err){
        res.status(400).send({ error: err.message });
    }
});


// Delete 
router.delete('/categories/:id', async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (category) {
        res.send({ message: `Category '${category.name}' has been deleted.` });
    } else {
        res.status(404).send({ error: `Category with id = '${req.params.id}' not found` });
    }
});



export default router