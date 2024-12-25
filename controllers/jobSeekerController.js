const db = require("../config/database");

// GET all job seekers
exports.getAllJobSeekers = (req, res) => {
  const sql = "SELECT * FROM job_seekers";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json(results);
  });
};

// GET job seeker by ID
exports.getJobSeekerById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM job_seekers WHERE seeker_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Job Seeker not found" });
    res.status(200).json(result[0]);
  });
};

// CREATE a new job seeker
exports.createJobSeeker = (req, res) => {
  const { user_id, resume, cover_letter, career_history } = req.body;

  if (!user_id || !resume || !cover_letter || !career_history) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO job_seekers (user_id, resume, cover_letter, career_history) VALUES (?, ?, ?, ?)";
  db.query(sql, [user_id, resume, cover_letter, career_history], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(201).json({ message: "Job Seeker created successfully", seeker_id: result.insertId });
  });
};

// DELETE a job seeker
exports.deleteJobSeeker = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM job_seekers WHERE seeker_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Job Seeker not found" });
    res.status(200).json({ message: "Job Seeker deleted successfully" });
  });
};
