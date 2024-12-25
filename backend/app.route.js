const express = require('express');
const router = express.Router();
const { Client } = require('pg');
const https = require('https');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
router.post('/login', (req, res) => {
  const { username, password } = req.body;
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

router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password])
    .then(() => {
      res.status(200).json({ message: 'Signup successful' });
    })
    .catch(err => res.status(500).json({ message: 'Error with signup', error: err }));
});


router.post('/create-contest', async (req, res) => {
    const { username, topic, difficulty, numQuestions } = req.body;
  
    const prompt = `Generate a quiz on the topic "${topic}" with difficulty "${difficulty}" and ${numQuestions} number of questions. The quiz should be a MCQ based quiz along with 4 options only with each option having its option_id like A, B, C and D and also the correct option should be the option_id for each question. The response should be in JSON format only. example: { "question": "What is the capital of India?", "options": [ { "option_id": "A", "option": "New Delhi" }, { "option_id": "B", "option": "Mumbai" }, { "option_id": "C", "option": "Kolkata" }, { "option_id": "D", "option": "Chennai" } ], ["correct_option":{ "option_id": "A", "option": "New Delhi" }] }`;
  
    try {
        const result = await model.generateContent(prompt);    
        let quizDetails = result.response.text();
    
        // Remove backticks and unnecessary whitespaces
        quizDetails = quizDetails.replace(/```json|```/g, '').trim();
    
        // Ensure quizDetails is valid JSON
        let quizDetailsJson;
        try {
          quizDetailsJson = JSON.parse(quizDetails);
        } catch (jsonError) {
          console.error('Error parsing quiz details:', jsonError);
          return res.status(500).json({ message: 'Error parsing quiz details', error: jsonError });
        }
    
        // Converting quizDetails to string
        const quizDetailsString = JSON.stringify(quizDetailsJson);
    
        // inserting contest into database
        await client.query('INSERT INTO contests (username, topic, difficulty, num_questions, quiz_details) VALUES ($1, $2, $3, $4, $5)', [username, topic, difficulty, numQuestions, quizDetailsString]);
    
        res.status(200).json({ message: 'Contest created successfully', quizDetails: quizDetailsJson});
      } catch (err) {
        console.error('Error creating contest:', err);
        res.status(500).json({ message: 'Error creating contest', error: err });
      }
    });

module.exports = router;