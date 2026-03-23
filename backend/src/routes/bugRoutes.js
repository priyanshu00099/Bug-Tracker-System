const express = require('express');
const router = express.Router();
const bugController = require('../controllers/bugController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// --- TESTER ROUTES ---

// Report a new bug (Now securely wrapped by physical image drop router)
router.post('/', auth(['Tester']), upload.single('image'), bugController.createBug);

// View only bugs reported by the current Tester
router.get('/reported', auth(['Tester']), bugController.getTesterBugs);


// --- DEVELOPER ROUTES ---

// View bugs assigned to the current Developer
router.get('/assigned', auth(['Developer']), bugController.getAssignedBugs);

// View closed bug history for the current Developer
router.get('/history', auth(['Developer']), bugController.getBugHistory);

// Update status (e.g., from Open to Fixed)
router.put('/:id/status', auth(['Developer', 'Admin', 'Tester']), bugController.updateStatus);


// --- ADMIN ROUTES ---

// View ALL bugs in the system
router.get('/', auth(['Admin']), bugController.getAllBugs);

// Assign a bug to a developer
router.put('/:id/assign', auth(['Admin']), bugController.assignBug);

// Delete a bug record
router.delete('/:id', auth(['Admin']), bugController.deleteBug);

// View ALL users explicitly for mapping names
router.get('/users/all', auth(['Admin']), bugController.getAllUsersList);


module.exports = router;