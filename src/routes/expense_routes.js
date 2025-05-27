
const express = require('express');
const Expense = require('../models/expense.js');
const router = express.Router();
const Trip = require('../models/trip.js')
const { verifyToken } = require('../auth.js'); 
const { badRequest } = require('../utils/responses.js');
const { handleError, handleValidationError } = require('../utils/helpers.js');

// Protect all routes in this router
router.use(verifyToken);

//helpers
async function updateTripTotal(tripId) {
  const total = await Expense.getTotalForTrip(tripId);
  await Trip.findByIdAndUpdate(tripId, { totalExpense: total });
}

async function findExpenseOrFail(id) {
  const expense = await Expense.findById(id);
  if (!expense) throw { status: 404, message: `Expense with id ${id} not found` };
  return expense;
}

// get all expenses
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
        handleError(res, err, 'Failed to get expenses');
    }
});

//Get one expense
router.get('/expenses/:id', async(req, res) => {
    try {
         // Get the id
        const expense = await findExpenseOrFail(req.params.id);
        res.send(expense);

    } catch (err) {
        handleError(res, err, 'Invalid expense ID format');
    }
});

// Create expense
router.post('/expenses', async(req,res) => {
    try {
        // Create the expense with the trip ID coming from request body or session
        const newExpense = await Expense.create({
        amount: req.body.amount,
        description: req.body.description,
        category: req.body.category,
        trip: req.body.trip  // make sure trip ID is provided here
        });

        await updateTripTotal(newExpense.trip);

        // Respond with success and new expense
        res.status(201).send(newExpense);
    }
    catch (err) {
        // solving the problem: it will return "something went wrong" instead of path "Path" is required 
        if (err.name === 'ValidationError') 
            return handleValidationError(res,err);
        handleError(res, err, 'Failed to create expense');
}
});

// Update 
router.put('/expenses/:id', async (req, res) => {
    try {
        // Fetch the post from the db
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (updatedExpense) {
            await updateTripTotal(updatedExpense.trip);
            res.send(updatedExpense);
        } else {
            throw { status: 404, message: `Expense with id ${req.params.id} not found` };
        }
    } catch (err) {
        handleError(res, err, 'Failed to update expense');
    }
});

// Delete 
router.delete('/expenses/:id', async (req, res) => {
    try {
        const expense = await findExpenseOrFail(req.params.id);
        const tripId = expense.trip; 
        // Actually delete the expense
        await expense.deleteOne(); 
        await updateTripTotal(tripId)

        res.send({ message: `Expense '${expense.description}' has been deleted.` });

    } catch (err) {
        handleError(res, err, 'Failed to delete expense');
    }
});


module.exports = router;