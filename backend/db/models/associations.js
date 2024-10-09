// models/associations.js

const User = require("./user");
const Role = require("./roles");
const Blog = require("./blogs");
const Comment = require("./comments");
const Permission = require("./permissions");
const RolePermission = require("./roles_permissions");

// Define associations
Role.hasMany(User, { foreignKey: "role_id", as: "users" });
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });
// models/associations.js

// Blog associations
Blog.hasMany(Comment, {
  foreignKey: "blog_id",
  onDelete: "CASCADE",
  as: "comments",
});
Comment.belongsTo(Blog, { foreignKey: "blog_id", as: "blog" });

// User associations
User.hasMany(Comment, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  as: "comments",
});
Comment.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Permissions and Roles associations
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
  otherKey: "permission_id",
  as: "permissions", // Define alias for role's permissions
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permission_id",
  otherKey: "role_id",
  as: "roles", // Define alias for permission's roles
});

// Additional associations for RolePermission
Role.hasMany(RolePermission, { foreignKey: "role_id", as: "rolePermissions" });
RolePermission.belongsTo(Role, { foreignKey: "role_id", as: "role" });

Permission.hasMany(RolePermission, {
  foreignKey: "permission_id",
  as: "rolePermissions",
});
RolePermission.belongsTo(Permission, {
  foreignKey: "permission_id",
  as: "permission",
});
