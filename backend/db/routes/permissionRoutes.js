const express = require('express');
const { getPermissions, getRolePermissions } = require('../controllers/permissionController');
const router = express.Router();

router.get('/permissions',getPermissions);
router.post('/permissions', getRolePermissions);

module.exports = router;