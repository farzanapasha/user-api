const db = require("../models/db");
const bcrypt = require('bcryptjs');

exports.addUser = (req, res) => {
  const { name, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  // Log the incoming request body for debugging purposes
  console.log("Received request body:", req.body);

  // Check if the user already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("❌ DB Query Error:", err.message);
      return res.status(500).json({ error: "Database error", details: err.message });
    }

    if (results.length > 0) {
      // User already exists
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("❌ Hashing Error:", err.message);
        return res.status(500).json({ error: "Error hashing password", details: err.message });
      }

      // Insert new user
      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("❌ DB Insert Error:", err.message);
            return res.status(500).json({ error: "Database Error", details: err.message });
          }

          // Respond with success message and user ID
          res.status(201).json({ message: "User added successfully", userId: result.insertId });
        }
      );
    });
  });
};

// Get all users
exports.getUsers = (req, res) => {
  const sql = "SELECT id, name, email FROM users"; // Avoid returning passwords for security reasons

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ DB Fetch Error:", err.message);
      return res.status(500).json({ error: "Database Error", details: err.message });
    }
    res.status(200).json(results);
  });
};

// Get a user by ID
exports.getUserById = (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT id, name, email FROM users WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("❌ DB Fetch Error:", err.message);
      return res.status(500).json({ error: "Database Error", details: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result[0]);
  });
};

// Update user by ID
exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  // Check if at least one field is provided
  if (!name && !email && !password) {
    return res.status(400).json({ error: "At least one field is required to update" });
  }

  const fieldsToUpdate = [];
  const values = [];

  if (name) {
    fieldsToUpdate.push("name = ?");
    values.push(name);
  }
  if (email) {
    fieldsToUpdate.push("email = ?");
    values.push(email);
  }
  if (password) {
    fieldsToUpdate.push("password = ?");
    values.push(password);
  }

  values.push(userId); // Add userId at the end for the WHERE clause

  const sql = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ DB Update Error:", err.message);
      return res.status(500).json({ error: "Database Error", details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found or no changes made" });
    }

    res.status(200).json({ message: "User updated successfully" });
  });
};

// Delete user by ID
exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("❌ DB Delete Error:", err.message);
      return res.status(500).json({ error: "Database Error", details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  });
};

