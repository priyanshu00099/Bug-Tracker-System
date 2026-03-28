const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Use the full connection string provided by hosting platforms like Render
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Use individual environment variables from .env for local development
  sequelize = new Sequelize(
    process.env.DB_NAME,     // database name
    process.env.DB_USER,     // username
    process.env.DB_PASSWORD, // password
    {
      host: process.env.DB_HOST, // e.g. 'localhost'
      port: process.env.DB_PORT || 5432, // required if using a connection pooler like port 6543 on Supabase
      dialect: 'postgres',       // changed from mysql to postgres
      logging: false,            // disable SQL logging
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  );
}

module.exports = sequelize;