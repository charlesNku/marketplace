const express = require('express');
const { registerUser, loginUser, getUsers } = require('../controllers/authController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/roleMiddleware.js');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, admin, getUsers);
router.get('/traders', protect, async (req, res) => {
    try {
        const { data: traders, error } = await supabase
            .from('users')
            .select('id, name, profile_image, role')
            .eq('role', 'trader');
        if (error) throw error;
        res.json(traders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
