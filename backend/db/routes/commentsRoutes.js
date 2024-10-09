const express = require('express');
const { getCommentsByBlogId, addComment, deleteComment } = require('../controllers/commentController');
const router = express.Router();

router.get('/comments/:blogId', getCommentsByBlogId);
router.post('/comments',addComment);
router.delete('/comments/:commentId',deleteComment);

module.exports = router;