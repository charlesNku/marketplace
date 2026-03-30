const express = require('express');
const { checkout } = require('../controllers/paymentController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/checkout', protect, checkout);

module.exports = router;
