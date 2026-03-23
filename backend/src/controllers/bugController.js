const Bug = require('../models/Bugs');
const User = require('../models/Users');

// 1. Admin: Get ALL bugs
exports.getAllBugs = async (req, res) => {
  try {
    const bugs = await Bug.findAll();
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Tester: Get only their reported bugs
exports.getTesterBugs = async (req, res) => {
  try {
    // Filter by reporter_id (the ID from your JWT token)
    const bugs = await Bug.findAll({ 
      where: { reporter_id: req.user.id } // Use ID instead of name
    });
    res.json(bugs);
  } catch (err) {
    console.error("DETAILED ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// 3. Developer: Get assigned bugs
exports.getAssignedBugs = async (req, res) => {
  try {
    // Filter by assignedTo (the ID from your JWT token)
    const bugs = await Bug.findAll({ 
      where: { assignedTo: req.user.id } 
    });
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch assigned bugs" });
  }
};

// 4. Developer: Get history (Closed bugs)
exports.getBugHistory = async (req, res) => {
  try {
    const bugs = await Bug.findAll({ 
      // Use req.user.id for consistency with assignedTo
      where: { assignedTo: req.user.id, status: 'Closed' } 
    });
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bug history" });
  }
};

// 5. Tester: Create a bug
exports.createBug = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    let imageUrl = null;
    
    // Safely extract active multer local storage route
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const bug = await Bug.create({
      title,
      description,
      priority,
      status: "Open",
      imageUrl,
      reporter_id: req.user.id 
    });
    res.status(201).json(bug);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Admin: Assign bug to developer
exports.assignBug = async (req, res) => {
  try {
    const { id } = req.params; 
    const { assignedTo } = req.body; 

    const bug = await Bug.findByPk(id);
    if (!bug) return res.status(404).json({ error: 'Bug not found' });

    bug.assignedTo = assignedTo;
    await bug.save();

    res.json({ message: 'Bug assigned successfully', bug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. Developer/Admin/Tester: Update Status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const bug = await Bug.findByPk(id);
    if (!bug) return res.status(404).json({ error: 'Bug not found' });

    bug.status = status;
    
    console.log("=== INCOMING STATUS UPDATE ===");
    console.log(`ID: ${id} | Role: ${req.user.role} | New Status: ${status}`);
    console.log(`Appended Desc Payload:`, req.body.appendDescription);
    
    if (req.body.appendDescription) {
       bug.description = bug.description + `\n\n${req.body.appendDescription}`;
    }
    await bug.save();

    res.json({ message: 'Status updated', bug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 8. Admin: Delete Bug
exports.deleteBug = async (req, res) => {
  try {
    const { id } = req.params;
    const bug = await Bug.findByPk(id);
    if (!bug) return res.status(404).json({ error: 'Bug not found' });

    await bug.destroy();
    res.json({ message: 'Bug deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};  

// 9. Admin: Get all users for mapping
exports.getAllUsersList = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'role'] });
    res.json(users);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};