import { Router } from 'express' ;
import Expense from '../models/expense.js';
const router = Router();

//get all expense
router.get('/expenses', async(req, res)=> {
    res.send(await Expense.find().populate('category'));
});
//Get one expense
router.get('/expenses/:id', async(req, res) => {
    // Get the id
    const expense_id = req.params.id; // string
    const expense = await Expense.findById(expense_id);
    //send the post back to the client
    if (expense) {
        res.send(expense);
    } else{
        res.status(404).send ({error:`Expense with id ${expense_id} not found`});
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
        // TODO: Log to error file
        res.status(400).send({ error: err.message });
    }
})

// Update 
async function update(req, res) {
    // 1. Fetch the post from the db
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'});
    if (expense) {
        res.send(expense);
    } else {
        res.status(404).send({ error: `Expense with id = '${req.params.id}' not found` });
    }
}

router.put('/expenses/:id', update);

// Delete 
router.delete('/expenses/:id', async (req, res) => {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (expense) {
        res.send({ message: `Expense '${expense.name}' has been deleted.` });
    } else {
        res.status(404).send({ error: `Expense with id = '${req.params.id}' not found` });
    }
})



export default router