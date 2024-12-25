const db = require("../config/database");

// GET all connections
exports.getAllConnections = (req, res) => {
  const sql = "SELECT * FROM connections";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json(results);
  });
};

// CREATE a new connection
exports.createConnection = (req, res) => {
  const { user_1_id, user_2_id, connection_type } = req.body;

  if (!user_1_id || !user_2_id || !connection_type) {
    return res.status(400).json({ message: "User IDs and connection type are required" });
  }

  const sql = "INSERT INTO connections (user_1_id, user_2_id, connection_type) VALUES (?, ?, ?)";
  db.query(sql, [user_1_id, user_2_id, connection_type], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(201).json({ message: "Connection created successfully", connection_id: result.insertId });
  });
};

// DELETE a connection
exports.deleteConnection = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM connections WHERE connection_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Connection not found" });
    res.status(200).json({ message: "Connection deleted successfully" });
  });
};
