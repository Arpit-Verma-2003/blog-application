// controllers/commentController.js
const User = require("../models/user"); // Adjust the path as needed
const Comment = require("../models/comments");
const Permission = require('../models/permissions');
const RolePermission = require('../models/roles_permissions.js');

const getCommentsByBlogId = async (req, res) => {
  const { blogId } = req.params; // Extract blogId from URL parameters
  try {
    // Fetch comments along with the associated user data
    const comments = await Comment.findAll({
      where: { blog_id: blogId }, // Condition to filter comments by blogId
      include: [
        {
          model: User,
          as: "user", // Alias used in the associations
          attributes: ["id", "username"], // Specify the fields to return from User model
        },
      ],
      attributes: ["id", "content", "user_id", "created_at"], // Specify the fields to return from Comment model
    });

    // Check if comments were found
    if (!comments.length) {
      return res.status(404).json({ message: "No comments found for this blog." });
    }

    // Respond with the comments data
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching the comments" });
  }
};


const addComment = async (req, res) => {
  const { blog_id, user_id, content } = req.body;

  try {
    // Use Sequelize's create method to insert a new comment
    const newComment = await Comment.create({
      blog_id, // Foreign key to the blog
      user_id, // Foreign key to the user
      content, // The comment's content
    });

    // Respond with success message
    res.status(201).json({
      message: "Successfully added comment",
      comment: newComment, // Optionally return the newly created comment
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error in adding comment" });
  }
};

const deleteComment = async (req, res) => {
  const { user_id, comment_id, role_id } = req.body;

  try {
    // Step 1: Fetch the role's permissions
    const rolePermissions = await RolePermission.findAll({
      where: { role_id },
      include: [{
        model: Permission,
        as: 'permission',
        attributes: ['permission_name']
      }]
    });

    console.log('Role Permissions Result:', rolePermissions);
    // Step 2: Extract the permissions from the result
    const userPermissions = rolePermissions
           .map(row => row.permission.length > 0 ? row.permission[0].dataValues.permission_name : null) // Safely access permission name
           .filter(Boolean);

    // Step 3: Check if the user has the 'delete_any_comment' permission
    if (userPermissions.includes('delete_any_comment')) {
      await Comment.destroy({ where: { id: comment_id } });
      return res.status(200).json({ message: 'Comment deleted successfully.' });
    }

    // Step 4: Fetch the comment to check ownership
    const comment = await Comment.findOne({ where: { id: comment_id } });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    // Step 5: Check if the comment belongs to the user
    if (comment.user_id !== user_id) {
      return res.status(403).json({ message: 'You can only delete your own comments.' });
    }

    // Step 6: Delete the comment if it belongs to the user
    await Comment.destroy({ where: { id: comment_id } });
    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment.' });
  }
};

module.exports = {
  getCommentsByBlogId,
  addComment,
  deleteComment
};
