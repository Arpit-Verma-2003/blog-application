const { DataTypes } = require('sequelize');
const {sequelize} = require('../connectionSeq'); // Import sequelize instance

const Blog = sequelize.define('Blog', {
  // Define attributes/columns based on your table structure
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true, // Auto-incrementing primary key
    primaryKey: true, // Primary key
    allowNull: false, // Not nullable
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false, // Not nullable
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false, // Not nullable
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true, // Optional
  },
  post: {
    type: DataTypes.TEXT,
    allowNull: true, // Nullable (as per your SQL definition)
  },
  createdon: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Set default value to current date/time
    allowNull: true, // Nullable (as per your SQL definition)
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true, // Nullable (as per your SQL definition)
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Nullable (as per your SQL definition)
    references: {
      model: 'users', // Name of the referenced table (assumed to be `users`)
      key: 'id', // Key in the referenced table
    },
  },
}, {
  // Additional options can be added here
  tableName: 'blogs', // Explicitly specify the table name
  timestamps: false, // Disable automatic timestamps (createdAt, updatedAt)
});

module.exports = Blog;
