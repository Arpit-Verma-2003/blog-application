const Role = require("../models/roles"); // Adjust the path to your Role model
const RolePermission = require("../models/roles_permissions");
// Controller to get all roles
const getRoles = async (req, res) => {
  try {
    // Fetch all roles from the roles table
    const roles = await Role.findAll({
      attributes: ["role_name"], // Specify only the role_name column
    });

    // Return the roles
    return res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return res.status(500).json({ message: "Error fetching the roles" });
  }
};

const addRole = async (req, res) => {
  const { roleName, permissionIds } = req.body; // Destructuring new role info

  try {
    // Create a new role in the roles table
    const newRole = await Role.create({ role_name: roleName });
    const roleId = newRole.id; // Get the new role ID

    // Loop through permissionIds and insert into the role-permissions association table
    for (const permissionId of permissionIds) {
      await RolePermission.create({
        role_id: roleId,
        permission_id: permissionId,
      });
    }

    res.status(201).json({ message: "Added a new role successfully" });
  } catch (error) {
    console.error("Error adding new role:", error);
    res.status(500).json({ message: "Unable to add the new role", err: error });
  }
};

module.exports = {
  getRoles,
  addRole
};
