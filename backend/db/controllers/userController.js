// controllers/userController.js
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Role = require("../models/roles");
const jwt = require("jsonwebtoken");

const fetchUsers = async (req, res) => {
  try {
    const result = await User.findAll({
      include: {
        model: Role,
        as: "role", // Ensure this matches the alias used in associations
        attributes: ["role_name"], // Specify the attributes you want to include from the role
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users." });
  }
};

const registerUser = async (req, res) => {
  const { username, email, password, confirm_password, role } = req.body;

  try {
    // Password validation regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;

    // Validate password strength
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    // Check if passwords match
    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if the email already exists
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ message: "Email Already Exists" });
    }

    // Check if the username already exists
    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
      return res.status(400).json({ message: "Username Already Exists" });
    }

    // Get role ID based on role name
    const roleResult = await Role.findOne({ where: { role_name: role } });
    if (!roleResult) {
      return res.status(400).json({ message: "Role does not exist" });
    }
    const roleId = roleResult.id;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await User.create({
      username,
      email,
      password: hashedPassword,
      role_id: roleId,
    });

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email using Sequelize
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare the password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    let token = jwt.sign({ email: `${email}` }, "secret");
    res.cookie("token", token);
    // For now, return the user data without JWT
    return res.status(200).json({
      message: "Login successful",
      userDetails: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role_id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error logging in" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).json({ message: "Logout failed", error: err });
  }
};

const checkLogin = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({ message: "User not logged in" });
    }

    // Verify the token if it exists
    const data = jwt.verify(token, "secret");
    const email = data.email;

    // Find user by email using Sequelize
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user details if logged in
    return res
      .status(200)
      .json({ message: "User logged in", loggedIn: true, user: user.toJSON() });
  } catch (error) {
    console.error("Error Checking Login:", error);
    res.status(500).json({ message: "Check Login Failed", err: error });
  }
};

const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { newRoleId: roleName } = req.body;

  try {
    // Find the role by role name
    const role = await Role.findOne({ where: { role_name: roleName } });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Update the user's role_id in the User model
    const [updatedRows] = await User.update(
      { role_id: role.id }, // Set new role_id
      { where: { id: userId } } // Where condition to find the user
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ message: "User not found or role not updated." });
    }
    res.status(200).json({ message: "User role updated successfully." });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Error updating user role." });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId); // Find user by primary key (id)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy(); // Delete the user

    res.status(200).json({ message: "User Successfully Deleted" });
  } catch (error) {
    console.error("Error Deleting The User:", error);
    res.status(500).json({ message: "Error Deleting The User" });
  }
};

module.exports = {
  fetchUsers,
  registerUser,
  login,
  updateUserRole,
  deleteUser,
  logout,
  checkLogin,
};
