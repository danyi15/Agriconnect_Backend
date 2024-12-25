const db = require("../config/database");

// GET all farmers
exports.getAllFarmers = (req, res) => {
  const sql = "SELECT * FROM farmers";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json(results);
  });
};

// GET farmer by ID
exports.getFarmerById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM farmers WHERE farmer_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Farmer not found" });
    res.status(200).json(result[0]);
  });
};

// CREATE a new farmer
exports.createFarmer = (req, res) => {
  const { user_id, farm_type, farm_size, location } = req.body;

  if (!user_id || !farm_type || !farm_size || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO farmers (user_id, farm_type, farm_size, location) VALUES (?, ?, ?, ?)";
  db.query(sql, [user_id, farm_type, farm_size, location], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(201).json({ message: "Farmer created successfully", farmer_id: result.insertId });
  });
};

// DELETE a farmer
exports.deleteFarmer = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM farmers WHERE farmer_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Farmer not found" });
    res.status(200).json({ message: "Farmer deleted successfully" });
  });
};
