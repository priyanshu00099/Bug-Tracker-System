const sequelize = require('./src/config/database');

async function alterTable() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB.");
    await sequelize.query("ALTER TABLE bugs ADD COLUMN imageUrl VARCHAR(255) NULL;");
    console.log("Successfully injected imageUrl via raw SQL.");
    process.exit(0);
  } catch(err) {
    if (err.message.includes('Duplicate column')) {
      console.log("Column already exists.");
      process.exit(0);
    } else {
      console.error(err);
      process.exit(1);
    }
  }
}
alterTable();
