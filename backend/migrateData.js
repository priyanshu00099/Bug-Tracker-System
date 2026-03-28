const { Sequelize, QueryTypes } = require('sequelize');
require('dotenv').config();

// Import existing Postgres models
const postgresSequelize = require('./src/config/database');
const User = require('./src/models/Users');
const Bug = require('./src/models/Bugs');

// Create temporary MySQL connection
const mysqlSequelize = new Sequelize(
  process.env.MYSQL_DB_NAME,
  process.env.MYSQL_DB_USER,
  process.env.MYSQL_DB_PASSWORD,
  {
    host: process.env.MYSQL_DB_HOST,
    port: process.env.MYSQL_DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

async function runMigration() {
  try {
    console.log('🔄 Connecting to both databases...');
    await mysqlSequelize.authenticate();
    console.log('✅ Connected to older MySQL.');
    
    await postgresSequelize.authenticate();
    console.log('✅ Connected to new PostgreSQL.');

    // Pre-create tables if they do not exist
    console.log('🔄 Syncing PostgreSQL schema...');
    await postgresSequelize.sync({ alter: true });

    // Fetch data using raw queries to avoid parsing schema differences
    console.log('📥 Fetching data from MySQL...');
    const users = await mysqlSequelize.query("SELECT * FROM users", { type: QueryTypes.SELECT });
    const bugs = await mysqlSequelize.query("SELECT * FROM bugs", { type: QueryTypes.SELECT });

    console.log(`📊 Found ${users.length} users and ${bugs.length} bugs. Migrating...`);

    // We use ignoreDuplicates so if this script is run twice, it doesn't crash on primary key conflict.
    if (users.length > 0) {
      await User.bulkCreate(users, { ignoreDuplicates: true });
      console.log('✅ Users migrated.');
    } else {
      console.log('ℹ️ No users to migrate.');
    }

    if (bugs.length > 0) {
      await Bug.bulkCreate(bugs, { ignoreDuplicates: true });
      console.log('✅ Bugs migrated.');
    } else {
      console.log('ℹ️ No bugs to migrate.');
    }

    // Correct the PostgreSQL internal sequences so future auto-increments start after the imported ID
    console.log('🔄 Resetting PostgreSQL sequences...');
    await postgresSequelize.query(`SELECT setval(pg_get_serial_sequence('users', 'id'), coalesce((SELECT MAX(id) FROM users), 1));`).catch(() => {});
    await postgresSequelize.query(`SELECT setval(pg_get_serial_sequence('bugs', 'id'), coalesce((SELECT MAX(id) FROM bugs), 1));`).catch(() => {});

    console.log('🎉 Data Migration completely successful!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
