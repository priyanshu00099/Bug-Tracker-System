const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // ✅ path to DB config

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  additional_roles: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ""
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;