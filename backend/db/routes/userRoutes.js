const express = require('express');
const { fetchUsers, registerUser, login, updateUserRole, deleteUser, logout, checkLogin } = require('../controllers/userController');
const router = express.Router();

router.get('/users', fetchUsers);
router.post('/register',registerUser);
router.post('/login',login);
router.put('/users/:userId',updateUserRole);
router.delete('/users/:userId',deleteUser);
router.post('/logout',logout);
router.get('/checklogin',checkLogin);

module.exports = router;