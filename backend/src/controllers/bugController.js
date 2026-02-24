const Bug = require('../models/Bugs');

exports.getAllBugs = async (req, res) => {
  try {
    const bugs = await Bug.findAll();
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBug = async (req, res) => {
  try {
    const { title, description, priority, reporter_id } = req.body;

    const bug = await Bug.create({
      title,
      description,
      priority,
      reporter_id
    });

    res.status(201).json(bug);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignBug = async (req, res) => {
  try {
    const { id } = req.params; 
    const { assignee_id, assignedTo } = req.body; // pull both values

    const bug = await Bug.findByPk(id);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    bug.assignee_id = assignee_id;
    bug.assignedTo = assignedTo;
    await bug.save();

    res.json({ message: 'Bug assigned successfully', bug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const bug = await Bug.findByPk(id);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    bug.status = status;
    await bug.save();

    res.json({ message: 'Bug status updated successfully', bug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBug = async (req, res) => {
};