require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client } = require('pg');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL client
const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Connect to PostgreSQL
client.connect();

// Routes
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Simulating login (replace with actual logic)
  client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password])
    .then(result => {
      if (result.rows.length > 0) {
        res.status(200).json({ message: 'Login successful', user: result.rows[0] });
      } else {
        res.status(400).json({ message: 'Invalid username or password' });
      }
    })
    .catch(err => res.status(500).json({ message: 'Error with login', error: err }));
});

app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  // Insert user into the database
  client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password])
    .then(() => {
      res.status(200).json({ message: 'Signup successful' });
    })
    .catch(err => res.status(500).json({ message: 'Error with signup', error: err }));
});

app.post('/create-contest', (req, res) => {
  const { username, topic, difficulty, numQuestions } = req.body;
  // Insert contest into the database
  client.query('INSERT INTO contests (username, topic, difficulty, num_questions) VALUES ($1, $2, $3, $4)', [username, topic, difficulty, numQuestions])
    .then(() => {
      res.status(200).json({ message: 'Contest created successfully' });
    })
    .catch(err => res.status(500).json({ message: 'Error creating contest', error: err }));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
