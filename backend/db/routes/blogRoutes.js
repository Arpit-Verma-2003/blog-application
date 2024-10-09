const express = require('express');
const { getBlogs, getBlogById, editBlog, createBlog, deleteBlog, getBlogsByAuthorId, uploadBlogImage } = require('../controllers/blogController');
const router = express.Router();
const {upload} = require('../middleware/multerMiddleware');

router.get('/blogs/:cat', getBlogs);
router.get('/blogsbyid/:id', getBlogById);
router.put('/blogs/:id',editBlog);
router.post('/blogs',createBlog);
router.delete('/blogs/:id',deleteBlog);
router.get('/author/blogs', getBlogsByAuthorId);
router.post('/blogsimage',upload.single('file'), uploadBlogImage);
module.exports = router;
