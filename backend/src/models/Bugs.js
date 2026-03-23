const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bug = sequelize.define('Bug', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Open', 'In Progress', 'Resolved', 'Closed'),
    defaultValue: 'Open'
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    defaultValue: 'Medium'
  },
  reporter_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assignee_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'bugs',
  timestamps: true
});

module.exports = Bug;