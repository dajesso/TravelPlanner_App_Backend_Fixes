
const express = require('express');
const Expense = require('../models/expense.js');
const router = express.Router();
const Trip = require('../models/trip.js')
const { verifyToken } = require('../auth.js'); 
const { badRequest } = require('../utils/responses.js');
const { handleError, handleValidationError } = require('../utils/helpers.js');

// Protect all routes in this router
router.use(verifyToken);

// Helpers------
// Recalculate and update the total expense amount for a trip
async function updateTripTotal(tripId) {
  // Get the sum of all expenses linked to the trip
  const total = await Expense.getTotalForTrip(tripId);
  // Update the trip document with the new total expense amount
  await Trip.findByIdAndUpdate(tripId, { totalExpense: total });
}

//Find an expense by ID or throw a 404 error if not found
async function findExpenseOrFail(id) {
  //Find an expense by ID
  const expense = await Expense.findById(id);
  // If not found ID
  if (!expense) throw { status: 404, message: `Expense with id ${id} not found` };
  return expense;
}

// Routes ------
// get all expenses
router.get('/expenses', async(req, res)=> {
  try {
    // Get trip ID from query param
    const tripId = req.query.trip; 
    // If no trip ID provided, respond with bad request error
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
    // Find the expense or throw 404 error if not found
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

    // Update the total expenses of the associated trip
    await updateTripTotal(newExpense.trip);

    // Respond with success and new expense
    res.status(201).send(newExpense);
  }
  catch (err) {
    // solving the problem: it will return "something went wrong" instead of path "Path" is required 
    // If validation error (e.g., missing required field), handle it specially
    if (err.name === 'ValidationError') 
      return handleValidationError(res,err);

    handleError(res, err, 'Failed to create expense');
  }
});

// Update 
router.put('/expenses/:id', async (req, res) => {
  try {
  /** Find and update the expense with new data, returning the updated document
  by default, 'findByIdAndUpdate' returns the original document as it was before the update.
  Adding { new: true } makes it return the updated document after applying the changes.
  */
  const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, {new: true});

  if (updatedExpense) {
    // Update total expense for the associated trip after changes
    await updateTripTotal(updatedExpense.trip);
    res.send(updatedExpense);
  } else {
    // If expense with given ID doesn't exist, throw 404 error
    throw { status: 404, message: `Expense with id ${req.params.id} not found` };
  }
  } catch (err) {
    handleError(res, err, 'Failed to update expense');
  }
});

// Delete 
router.delete('/expenses/:id', async (req, res) => {
try {
  // Find the expense or throw 404 if not found
  const expense = await findExpenseOrFail(req.params.id);

  // Store trip ID before deletion to update totals later
  const tripId = expense.trip; 

  // Delete the expense document from the database
  await expense.deleteOne(); 

  // Update the trip's total expense after deletion
  await updateTripTotal(tripId)

  res.send({ message: `Expense '${expense.description}' has been deleted.` });

  } catch (err) {
    handleError(res, err, 'Failed to delete expense');
  }
});


module.exports = router;