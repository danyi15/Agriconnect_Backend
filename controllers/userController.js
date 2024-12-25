const db = require("../config/database");
const bcrypt = require("bcrypt");
const { validateEmail, validatePhoneNumber } = require("../utils/validation");

// Function to handle user registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone_number } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone number if provided
    if (phone_number && !validatePhoneNumber(phone_number)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Validate role
    const validRoles = [
      "petani",
      "ahli",
      "admin",
      "pemilik",
      "pelamar",
      "perusahaan",
    ];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO users (name, email, password_hash, role, phone_number) 
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [name, email, password_hash, role, phone_number],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already exists" });
          }
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }
        res.status(201).json({
          message: "User registered successfully",
          userId: result.insertId,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Function to handle user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Remove sensitive data before sending response
      delete user.password_hash;

      res.status(200).json({
        message: "Login successful",
        user: user,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Function to get all users (admin only)
exports.getUsers = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const sql = `
    SELECT user_id, name, email, role, phone_number, created_at, updatedAt 
    FROM users
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
};

// Function to delete user (admin only)
exports.deleteUser = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const sql = "DELETE FROM users WHERE user_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  });
};
