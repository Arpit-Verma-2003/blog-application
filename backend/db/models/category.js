const { DataTypes } = require('sequelize');
const {sequelize} = require('../connectionSeq');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'categories', // Specify table name explicitly
  timestamps: false // Disable timestamps if not needed
});

module.exports = Category;
