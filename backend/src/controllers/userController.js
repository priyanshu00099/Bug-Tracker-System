const User = require('../models/Users');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'additional_roles'] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Prevent SuperAdmin from deleting themselves (optional but recommended)
    if (user.id === req.user.id) {
        return res.status(403).json({ error: 'Cannot delete yourself' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Optional constraint: Do not allow altering own role to avoid lockout
    if (user.id === req.user.id) {
      return res.status(403).json({ error: 'Cannot update your own role' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const bcrypt = require('bcryptjs');

// Update user details (name, email, password)
exports.updateUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, additional_roles } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (additional_roles !== undefined) user.additional_roles = additional_roles;
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password_hash = hashedPassword;
    }

    await user.save();
    res.json({ message: 'User details updated successfully', user: { id: user.id, name: user.name, email: user.email, role: user.role, additional_roles: user.additional_roles } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
