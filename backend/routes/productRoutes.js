const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { trader, admin } = require('../middleware/roleMiddleware.js');

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').get(getProductById).put(protect, trader, updateProduct).delete(protect, trader, deleteProduct);

module.exports = router;
