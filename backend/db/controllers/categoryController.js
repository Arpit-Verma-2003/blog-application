const Category = require("../models/category");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll(); // Fetch all categories using Sequelize
    return res.json({ data: categories });
  } catch (error) {
    console.error("Error in getting the Categories:", error);
    res.status(500).json({ message: "Error in getting the Categories" });
  }
};

const addCategory = async (req, res) => {
  const { name } = req.body; // Extract category name from request body
  try {
    const newCategory = await Category.create({ name }); // Create new category using Sequelize
    return res.json({ success: true, data: newCategory }); // Return success response with new category data
  } catch (error) {
    console.error("Error in adding the category:", error);
    res.status(500).json({ message: "Error in adding the category" }); // Return error response
  }
};

const deleteCategory = async (req, res) => {
    const { categoryName } = req.params;
  
    try {
      // Find the category by name and delete it
      const deletedCategory = await Category.destroy({
        where: { name: categoryName },
      });
  
      if (deletedCategory) {
        return res.status(200).json({ success: true, message: 'Category deleted successfully' });
      } else {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
    } catch (error) {
      console.error('Error in deleting category:', error);
      res.status(500).json({ message: 'Error in deleting the category' });
    }
  };

module.exports = { getCategories,addCategory,deleteCategory };
