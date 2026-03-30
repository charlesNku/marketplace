const express = require('express');
const { createOrder, getOrders, getOrderById, updateDeliveryStatus } = require('../controllers/orderController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { trader } = require('../middleware/roleMiddleware.js');

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, getOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/delivery').put(protect, trader, updateDeliveryStatus);

module.exports = router;
