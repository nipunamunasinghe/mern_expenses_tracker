const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');

// Get all expenses
router.get('/', (req, res) => {
  Expense.find()
    .then((expenses) => res.json(expenses))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Add a new expense
router.post('/add', (req, res) => {
  const { title, amount} = req.body;
  const newExpense = new Expense({ title, amount});

  newExpense
    .save()
    .then(() => res.json('Expense added!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Update an expense
router.post('/update/:id', (req, res) => {
  Expense.findById(req.params.id)
    .then((expense) => {
      expense.title = req.body.title;
      expense.amount = req.body.amount;
      expense.date = req.body.date;

      expense
        .save()
        .then(() => res.json('Expense updated!'))
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Delete an expense
router.delete('/:id', (req, res) => {
  Expense.findByIdAndDelete(req.params.id)
    .then(() => res.json('Expense deleted!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
