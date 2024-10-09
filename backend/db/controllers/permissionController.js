const Permission = require("../models/permissions");
const Role = require("../models/roles");

const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll(); // Use Sequelize's findAll method
    res.status(200).json(permissions);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Unable to fetch the permissions" });
  }
};

const getRolePermissions = async (req, res) => {
  const { roleId } = req.body; // Destructure roleId from the request body
  try {
    // Use Sequelize to find permissions associated with the given role ID
    const roleWithPermissions = await Role.findOne({
      where: { id: roleId },
      include: {
        model: Permission,
        as: 'permissions',
        through: {
          attributes: [], // Exclude the join table attributes
        },
      },
    });

    if (!roleWithPermissions) {
      return res.status(404).json({ valid: false, message: "Role not found" });
    }

    // Map the permissions to get their names
    const permissions = roleWithPermissions.permissions.map(
      (permission) => permission.permission_name
    );

    return res.json({
      valid: true,
      permissions: permissions,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: "Error fetching role permissions" });
  }
};

// Export the controller function
module.exports = {
  getRolePermissions,
  getPermissions,
};
