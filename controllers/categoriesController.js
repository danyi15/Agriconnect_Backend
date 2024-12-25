const db = require("../config/database");

// GET all categories
exports.getAllCategories = (req, res) => {
  const sql = "SELECT * FROM categories";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json(results);
  });
};

// CREATE a new category
exports.createCategory = (req, res) => {
  const { category_name, category_type } = req.body;

  if (!category_name || !category_type) {
    return res.status(400).json({ message: "Category name and type are required" });
  }

  const sql = "INSERT INTO categories (category_name, category_type) VALUES (?, ?)";
  db.query(sql, [category_name, category_type], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(201).json({ message: "Category created successfully", category_id: result.insertId });
  });
};

// DELETE a category
exports.deleteCategory = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM categories WHERE category_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
  });
};
