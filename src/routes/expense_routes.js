
const express = require('express');
const Expense = require('../models/expense.js');
const router = express.Router();
const Trip = require('../models/trip.js')
const { verifyToken } = require('../auth.js'); 
const { badRequest, notFound, serverError } = require('../utils/responses.js');

// Protect all routes in this router
router.use(verifyToken);

//get all expense
router.get('/expenses', async(req, res)=> {
    try {
        // Get trip ID from query param
        const tripId = req.query.trip; 
        if (!tripId) {
            return badRequest(res, 'Trip ID is required to fetch expenses');
        }
        // Find all expenses that belong to the specified trip
        const expenses = await Expense.find({ trip: tripId }).populate('category');
        res.send(expenses);
        
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
        //Create the expense with the trip ID coming from request body or session
        const newExpense = await Expense.create({
        amount: req.body.amount,
        description: req.body.description,
        category: req.body.category,
        trip: req.body.trip  // make sure trip ID is provided here
        });

        // 2. Calculate total expense for this trip using your static method
        const total = await Expense.getTotalForTrip(newExpense.trip);

        // 3. Update the trip document's totalExpense field
        await Trip.findByIdAndUpdate(newExpense.trip, { totalExpense: total });

        // 4. Respond with success and new expense
        res.status(201).send(newExpense);
    }
    catch (err) {
        // solving the problem: it will return "something went wrong" instead of path "Path" is required 
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ error: errors });
        }

        console.error(err);
        return res.status(500).json({ error: 'Something went wrong on the server' });
}
});

// Update 
async function update(req, res) {
    try {
        // Fetch the post from the db
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'});
        if (expense) {
            // Recalculate totalExpense for the trip
            const total = await Expense.getTotalForTrip(expense.trip);
            await Trip.findByIdAndUpdate(expense.trip, { totalExpense: total });
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
            const total = await Expense.getTotalForTrip(tripId);
            await Trip.findByIdAndUpdate(tripId, { totalExpense: total });
            res.send({ message: `Expense '${expense.name}' has been deleted.` });
        } else {
            notFound(res, `Expense with id ${req.params.id} not found`);
        }
    } catch (err) {
        badRequest(res, 'Invalid expense ID format');
    }
});

module.exports = router;