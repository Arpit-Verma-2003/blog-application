// models/Comment.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../connectionSeq'); // Adjust the path as needed

// Define the Comment model using sequelize.define
const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  blog_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true,
  },
}, {
  tableName: 'comments', // Use the existing table name
  timestamps: false, // Disable automatic timestamps
});

// Define associations outside the model definition
Comment.associate = (models) => {
  Comment.belongsTo(models.Blog, { foreignKey: 'blog_id', onDelete: 'CASCADE' });
  Comment.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
};

module.exports = Comment;
