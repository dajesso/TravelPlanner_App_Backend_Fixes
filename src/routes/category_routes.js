
import { Router } from 'express' 
import Category from '../models/category.js'

const router = Router()

//get all category
router.get('/categories', async(req, res)=> {
    res.send(await Category.find());
});

//Get one category
router.get('/categories/:id', async(req, res) => {
    // Get the id
    const category_id = req.params.id // string

    const category = await Category.findById(category_id);

    //send the post back to the client
    if (category) {
        res.send(category)

    } else{
        res.status(404).send ({error:`Category with id ${category_id} not found`})
    }

});

// Create category
router.post('/categories', async(req,res) => {
    try {
        // Get data from the request body abd check if the name is unique
        const exists = await Category.findOne({ name: req.body.name });
        // if the category name already exists
        if (exists) {
        return res.status(400).send({ error: 'Category name already exists' });
        }
        // Create and save new category
        const category = await Category.create(bodyData)
        // Send post to the client with 201 status
        res.status(201).send(category)
    }
    catch (err) {
        // TODO: Log to error file
        res.status(400).send({ error: err.message })
    }
})



export default router