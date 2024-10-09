const { DataTypes } = require('sequelize');
const {sequelize} = require('../connectionSeq'); // Adjust the path to your Sequelize connection

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  permission_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'permissions', // Specify the exact table name
  timestamps: false, // If you don't have `createdAt` and `updatedAt` fields
});

module.exports = Permission;
