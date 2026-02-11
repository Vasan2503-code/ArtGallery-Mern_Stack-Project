
const express = require('express');
const router = express.Router();
const PaymentController = require('../controller/PaymentController');

router.post('/order', PaymentController.createOrder);
router.post('/verify', PaymentController.verifyPayment);

module.exports = router;
 