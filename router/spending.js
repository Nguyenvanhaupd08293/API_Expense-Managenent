const express = require('express');
const router = express.Router();
const {
    getSpending,
    getSpendbyId,
    addSpend,
    updateSpending,
    deleteSpending
} = require('../controllers/spending');
router.get('/spending', getSpending);
router.get('/spending/:id', getSpendbyId);
router.post('/add/spending', addSpend);
router.put('/spending/:id', updateSpending);
router.delete('/spending/:id', deleteSpending);

module.exports = router;