const express = require('express');
const { getRoles, addRole } = require('../controllers/rolesController');
const router = express.Router();

router.get('/roles',getRoles);
router.post('/roles',addRole);

module.exports = router;