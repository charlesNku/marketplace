const express = require('express');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/').get(protect, getCart);
router.route('/add').post(protect, addToCart);
router.route('/remove').delete(protect, removeFromCart);

module.exports = router;
