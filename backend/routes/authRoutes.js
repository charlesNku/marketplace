const express = require('express');
const { registerUser, loginUser, getUsers } = require('../controllers/authController.js');
const supabase = require('../config/supabaseClient');
const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/roleMiddleware.js');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, admin, getUsers);
router.get('/traders', protect, async (req, res) => {
    try {
        let query = supabase
            .from('users')
            .select('id, name, profile_image, role');

        if (req.user.role === 'admin') {
            // Admin sees all traders
            query = query.eq('role', 'trader');
        } else if (req.user.role === 'trader') {
            // Trader sees admin(s)
            query = query.eq('role', 'admin');
        } else {
            // Others see traders (default behavior)
            query = query.eq('role', 'trader');
        }

        const { data: partners, error } = await query;
        if (error) throw error;
        res.json(partners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
