const bcrypt = require('bcryptjs');
const User = require('./src/models/Users');
const sequelize = require('./src/config/database');

async function createSuperAdmin() {
  try {
    await sequelize.sync();
    const email = 'superadmin@bugtracker.com';
    const password = 'superadmin';

    const existing = await User.findOne({ where: { email } });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name: 'System Owner',
        email: email,
        password_hash: hashedPassword,
        role: 'SuperAdmin'
      });
      console.log('SuperAdmin user created successfully.');
    } else {
      console.log('SuperAdmin user already exists.');
    }
  } catch (error) {
    console.error('Error creating SuperAdmin:', error);
  } finally {
    process.exit(0);
  }
}

createSuperAdmin();
