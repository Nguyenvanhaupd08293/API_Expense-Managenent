const express = require('express');
const router = express.Router();
const { getIncome } = require('../controllers/income');
router.get('/income', getIncome);
module.exports = router;