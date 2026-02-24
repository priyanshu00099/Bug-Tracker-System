const express = require('express');
const router = express.Router();
const bugController = require('../controllers/bugController');
const auth = require('../middleware/auth');

// Tester can report bugs
router.post('/', auth(), bugController.createBug);

// Admin can assign bugs
router.put('/:id/assign', auth(['Admin']), bugController.assignBug);

// Developer can update status
router.put('/:id/status', auth(['Developer']), bugController.updateStatus);

// All roles can view bugs
router.get('/', auth(), bugController.getAllBugs);

router.delete('/:id', auth(['Admin']), bugController.deleteBug)

module.exports = router;