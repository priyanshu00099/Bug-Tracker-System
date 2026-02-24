const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use environment variables from .env
const sequelize = new Sequelize(
  process.env.DB_NAME,     // database name
  process.env.DB_USER,     // username
  process.env.DB_PASSWORD, // password
  {
    host: process.env.DB_HOST, // e.g. 'localhost'
    dialect: 'mysql',          // or 'postgres'
    logging: false             // disable SQL logging
  }
);

module.exports = sequelize;