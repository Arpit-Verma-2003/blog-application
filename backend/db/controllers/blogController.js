const { Op } = require("sequelize");
const Blog = require("../models/blogs"); // Adjust the path as necessary

// Controller to get blogs
const getBlogs = async (req, res) => {
  const { cat } = req.params;
  const { page = 1, limit = 9, search = "" } = req.query;1
  const offset = (page - 1) * limit;

  try {
    const queryOptions = {
      where: {},
      limit: parseInt(limit, 10),
      offset: offset,
    };

    // Handle category filter
    if (cat !== "all") {
      queryOptions.where.category = cat;
    }

    // Handle search functionality
    if (search) {
      queryOptions.where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { post: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const result = await Blog.findAndCountAll(queryOptions);

    return res.json({ data: result.rows, total: result.count });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// controller to get a particular blog by id

const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    return res.json({ data: blog });
  } catch (err) {
    console.error("Error fetching blog by ID:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

const getBlogsByAuthorId = async (req, res) => {
  const search = req.query.search || "";
  const userId = req.query.uid;

  try {
    const result = await Blog.findAll({
      where: {
        author_id: userId,
        title: {
          [Op.iLike]: `%${search}%`, // Case-insensitive search
        },
      },
    });

    return res.json({ valid: true, data: result });
  } catch (error) {
    console.error("Error fetching blogs by author:", error);
    return res
      .status(500)
      .json({ valid: false, message: "Error fetching blogs." });
  }
};

const editBlog = async (req, res) => {
  const { id } = req.params;
  const { title, image, post, category } = req.body;

  try {
    // Check if the blog exists
    const blog = await Blog.findByPk(id); // Use Sequelize to find the blog by primary key

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Update the blog with new data
    await blog.update({
      title,
      image,
      post,
      category,
    });

    res
      .status(200)
      .json({ success: true, message: "Blog updated successfully." });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Error updating blog." });
  }
};

const createBlog = async (req, res) => {
  const { author, author_id, title, image, post, category } = req.body; // Use 'author_id' to match the database field

  try {
    const newBlog = await Blog.create({
      author,
      author_id,
      title,
      image,
      post,
      category,
    });

    return res.status(201).json({ data: newBlog }); // Return the newly created blog
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ message: "Error creating blog." });
  }
};

const deleteBlog = async (req, res) => {
  const blogId = req.params.id; // Get the blog ID from the request parameters

  try {
    // Use the destroy method to delete the blog by its primary key
    const result = await Blog.destroy({
      where: {
        id: blogId,
      },
    });

    if (result) {
      // If a row was deleted, result will be a number greater than 0
      return res.json({ valid: true, message: "Blog deleted" });
    } else {
      // If no row was deleted, it means the blog ID was not found
      return res.status(404).json({ valid: false, message: "Blog not found" });
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res
      .status(500)
      .json({ valid: false, message: "Error deleting blog." });
  }
};

const uploadBlogImage = (req, res) => {
  // This function will be called after multer processes the file
  try {
    if (!req.file) {
      console.log("No file received:", req.file); // Log file data
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File uploaded successfully:", req.file);

    // req.file contains the uploaded file details
    return res.status(200).json({ path: normalizedPath });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ error: "Error uploading the image" });
  }
};

// Export all blog-related controllers
module.exports = {
  getBlogs,
  getBlogById,
  editBlog,
  createBlog,
  deleteBlog,
  getBlogsByAuthorId,
  uploadBlogImage,
};
