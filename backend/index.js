const express = require("express");
const cors = require("cors");
const session = require('express-session');
const cookieParser = require("cookie-parser");
const {connection,sequelize} = require("./db/connectionSeq");
const { authenticateToken } = require('./db/middleware/authMiddleware');
const blogRoutes = require('./db/routes/blogRoutes');
const userRoutes = require('./db/routes/userRoutes');
const categoryRoutes = require('./db/routes/categoryRoutes');
const commentRoutes = require('./db/routes/commentsRoutes');
const rolesRoutes = require('./db/routes/rolesRoutes');
const permissionRoutes = require('./db/routes/permissionRoutes');
const app = express();
const port = 3001;
require('./db/models/associations');
// Middleware

app.use(cors({
  origin: 'http://localhost:5173', // Specify the frontend URL
  credentials: true // Allow credentials
}));
app.use(express.json());
app.use(session({
  secret: 'your_secret_key', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));
app.use(cookieParser());
app.use('/uploads',express.static('uploads'));
app.use('/api', blogRoutes);
app.use('/api',userRoutes);
app.use('/api',categoryRoutes);
app.use('/api',commentRoutes);
app.use('/api',rolesRoutes);
app.use('/api',permissionRoutes);

app.get('/api/user', authenticateToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

const syncDatabase = async () => {
  try {
    await connection(); // Ensure the connection is established first
    await sequelize.sync(); // Syncs all defined models to the DB
    console.log("All models were synchronized successfully.");
    
    // Start the server after successful synchronization
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
};

syncDatabase();
