const { DataTypes } = require("sequelize");
const { sequelize } = require("../connectionSeq"); // Adjust the path to your Sequelize connection
const Role = require("./roles"); // Assuming you have a Role model defined
const Permission = require("./permissions"); // Assuming you have a Permission model defined

const RolePermission = sequelize.define(
  "RolePermission",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Based on your SQL definition
      references: {
        model: Role, // Refers to Role model
        key: "id",
      },
      onDelete: "CASCADE",
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Based on your SQL definition
      references: {
        model: Permission, // Refers to Permission model
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "roles_permissions", // Specify the exact table name
    timestamps: false, // Assuming you don't have createdAt and updatedAt columns
  }
);

module.exports = RolePermission;
