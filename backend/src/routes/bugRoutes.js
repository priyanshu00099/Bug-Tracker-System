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

router.get("/", auth(["Admin", "Tester"]), async (req, res) => {
    try {
      const bugs = await Bug.find(); // or your DB query
      res.json(bugs);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

router.delete('/:id', auth(['Admin']), bugController.deleteBug)

module.exports = router;