const db = require("../config/database");

// GET all reviews
exports.getAllReviews = (req, res) => {
  const sql = "SELECT * FROM reviews";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json(results);
  });
};

// CREATE a new review
exports.createReview = (req, res) => {
  const { reviewer_id, target_id, target_type, rating, comment } = req.body;

  if (!reviewer_id || !target_id || !target_type || !rating) {
    return res.status(400).json({ message: "Reviewer ID, target ID, target type, and rating are required" });
  }

  const sql = "INSERT INTO reviews (reviewer_id, target_id, target_type, rating, comment) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [reviewer_id, target_id, target_type, rating, comment], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(201).json({ message: "Review created successfully", review_id: result.insertId });
  });
};

// DELETE a review
exports.deleteReview = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM reviews WHERE review_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review deleted successfully" });
  });
};
