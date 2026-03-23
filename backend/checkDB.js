const sequelize = require('./src/config/database');
const Bug = require('./src/models/Bugs');

async function testQuery() {
  try {
    await sequelize.authenticate();
    const bugs = await Bug.findAll();
    console.log("=== BUG DATABASE DUMP ===");
    bugs.forEach(b => {
      console.log(`ID: ${b.id} | Status: ${b.status}`);
      console.log(`Description: ${b.description}`);
      console.log("-------------------");
    });
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}
testQuery();
