require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT, NODE_PORT } = process.env;

const uri = `mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}`
const app = express()
const port = NODE_PORT || 3000;

const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });
const connection = mysql.createConnection(uri)

app.use(bodyParser.json());
app.use(morgan('combined', { stream: accessLogStream }));

const initializeDatabase = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('[ERROR] Failed to initialize database:', err);
    } else {
      console.log('[INFO] Database initialized successfully');
    }
  });
};

// Call database initialization
connection.connect((err) => {
  if (err) {
    console.error('[ERROR] Database connection failed:', err);
  } else {
    console.log('[INFO] Connected to database');
    initializeDatabase();
  }
});

app.get('/', (req, res) => {
  console.log(`[INFO] Root endpoint hit`); // Log request
  res.send('User Management API');
});

// Get all users
app.get('/users', async (req, res) => {
  console.log(`[INFO] Fetching all users`);
  try {
    const [users] = await connection.promise().query('SELECT id, name, email FROM users');
    console.log(`[SUCCESS] Retrieved ${users.length} users`);
    res.json({ data: { users } });
  } catch (error) {
    console.error(`[ERROR] Failed to fetch users:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get a single user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`[INFO] Fetching user with ID: ${id}`);
  try {
    const [users] = await connection.promise().query('SELECT id, name, email FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      console.warn(`[WARN] User with ID ${id} not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`[SUCCESS] Retrieved user:`, users[0]);
    res.json({ data: { user: users[0] } });
  } catch (error) {
    console.error(`[ERROR] Failed to fetch user:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Add a new user
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  console.log(`[INFO] Adding new user: ${name}, ${email}`);
  if (!name || !email || !password) {
    console.warn(`[WARN] Missing required fields`);
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  try {
    const [result] = await connection.promise().query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    console.log(`[SUCCESS] User added with ID: ${result.insertId}`);
    res.json({ data: { id: result.insertId, name, email } });
  } catch (error) {
    console.error(`[ERROR] Failed to add user:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Update a user
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  console.log(`[INFO] Updating user ID: ${id}`);
  try {
    const [result] = await connection.promise().query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, id]);
    if (result.affectedRows === 0) {
      console.warn(`[WARN] User with ID ${id} not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`[SUCCESS] User updated: ID ${id}`);
    res.json({ data: { id, name, email } });
  } catch (error) {
    console.error(`[ERROR] Failed to update user:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`[INFO] Deleting user ID: ${id}`);
  try {
    const [result] = await connection.promise().query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      console.warn(`[WARN] User with ID ${id} not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`[SUCCESS] User ID ${id} deleted`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(`[ERROR] Failed to delete user:`, error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`[INFO] Server running on port ${port}`);
});
