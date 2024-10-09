const bcrypt = require('bcrypt');
const { User, Role } = require('../models'); // Adjust the path as necessary

exports.register = async (req, res) => {
  const { username, email, password, confirm_password, role } = req.body;

  try {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must meet complexity requirements." });
    }
    
    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email or username already exists
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ message: "Email Already Exists" });
    }

    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
      return res.status(400).json({ message: "Username Already Exists" });
    }

    // Fetch role ID from Role table
    const roleRecord = await Role.findOne({ where: { name: role } });
    if (!roleRecord) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await User.create({
      username,
      email,
      password: hashedPassword,
      role_id: roleRecord.id,  // role_id is the foreign key
    });

    return res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registering user.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Set session data
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role_id
    };

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
      }
      return res.status(200).json({ message: "Login successful", userDetails: req.session.user });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging in' });
  }
};
