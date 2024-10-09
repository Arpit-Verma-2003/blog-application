const express = require('express');
const { getCategories, addCategory, deleteCategory } = require('../controllers/categoryController');
const router = express.Router();

router.get('/categories', getCategories);
router.post('/categories', addCategory);
router.delete('/categories/:categoryName', deleteCategory);

module.exports = router;