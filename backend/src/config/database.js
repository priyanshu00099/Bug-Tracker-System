const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use environment variables from .env
const sequelize = new Sequelize(
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

module.exports = sequelize;