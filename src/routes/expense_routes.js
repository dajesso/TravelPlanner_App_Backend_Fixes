
const express = require('express');
const Expense = require('../models/expense.js');
const router = express.Router();


//get all expense
router.get('/expenses', async(req, res)=> {
    try {
        res.send(await Expense.find().populate('category'));
    } catch(err) {
        serverError(res, 'Failed to get expenses');
    }
});
//Get one expense
router.get('/expenses/:id', async(req, res) => {
    try {
         // Get the id
        const expense_id = req.params.id; // string
        const expense = await Expense.findById(expense_id);
        //send the post back to the client
        if (expense) {
            res.send(expense);
        } else{
            notFound(res, `Expense with id ${req.params.id} not found`);
        }
    } catch (err) {
        badRequest(res, 'Invalid expense ID format');
    }
});
// Create expense
router.post('/expenses', async(req,res) => {
    try {
        // Get data from the request body 
        const bodyData = req.body;
        // Create and save new expense
        const expense = await Expense.create(bodyData);
        // Send post to the client with 201 status
        res.status(201).send(expense);
    }
    catch (err) {
        // solving the problem: it will return "something went wrong" instead of path "Path" is required 
        if (err.name === 'ValidationError') {
            // Send the detailed validation errors object
            return badRequest(res, formatValidationErrors(err.errors));
        }
         // For other errors, send generic error message
        badRequest(res, err.message);
        }
});

// Update 
async function update(req, res) {
    try {
        // Fetch the post from the db
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'});
        if (expense) {
            res.send(expense);
        } else {
            notFound(res, `Expense with id ${req.params.id} not found`);
        }
    } catch (err) {
        badRequest(res, 'Invalid expense ID format');
    }
};

router.put('/expenses/:id', update);

// Delete 
router.delete('/expenses/:id', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (expense) {
            res.send({ message: `Expense '${expense.name}' has been deleted.` });
        } else {
            notFound(res, `Expense with id ${req.params.id} not found`);
        }
    } catch (err) {
        badRequest(res, 'Invalid expense ID format');
    }
});

module.exports = router;