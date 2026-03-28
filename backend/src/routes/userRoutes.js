const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// --- SUPERADMIN ROUTES ---

// View all users
router.get('/', auth(['SuperAdmin']), userController.getAllUsers);

// Delete a user
router.delete('/:id', auth(['SuperAdmin']), userController.deleteUser);

// Update user role
router.put('/:id/role', auth(['SuperAdmin']), userController.updateUserRole);

// Update user details (name, email, password)
router.put('/:id/details', auth(['SuperAdmin']), userController.updateUserDetails);

module.exports = router;
