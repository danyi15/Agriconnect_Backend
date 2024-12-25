const db = require("../config/database");

// GET all questions
exports.getAllQuestions = (req, res) => {
  const sql = "SELECT * FROM questions";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json(results);
  });
};

// CREATE a new question
exports.createQuestion = (req, res) => {
  const { title, description, asker_id, category_id } = req.body;

  if (!title || !description || !asker_id || !category_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO questions (title, description, asker_id, category_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [title, description, asker_id, category_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(201).json({ message: "Question created successfully", question_id: result.insertId });
  });
};

// DELETE a question
exports.deleteQuestion = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM questions WHERE question_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Question not found" });
    res.status(200).json({ message: "Question deleted successfully" });
  });
};
