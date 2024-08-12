const express = require('express');
const router = express.Router();
const {
    updateSpending,
    deleteIncome,
    getIncome,
    getIncomebyId,
    addIncome
} = require('../controllers/income');
router.get('/income', getIncome);
router.get('/income/:id', getIncomebyId);
router.post('/add/income', addIncome);
router.put('/income/:id', updateSpending);
router.delete('/income/:id', deleteIncome);

module.exports = router;