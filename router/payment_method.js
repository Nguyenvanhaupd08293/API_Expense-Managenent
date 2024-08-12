const express = require('express');
const router = express.Router();
const { getPaymentMethod } = require('../controllers/payment_method');
router.get('/paymentmethod', getPaymentMethod);
module.exports = router;