const express = require('express');
const { registerUser, loginUser, getUsers } = require('../controllers/authController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/roleMiddleware.js');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, admin, getUsers);

module.exports = router;
