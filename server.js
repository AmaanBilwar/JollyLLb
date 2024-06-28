require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Set the view engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Default route
app.get('/', (req, res) => {
  res.render('index');
});

// Route to handle chatbot messages
app.post('/chat', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY; 
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-2024-05-13',
        messages: [
          { role: 'system', content: 'You are a friendly chatbot that gives people legal advice. anything except that is strictly prohibited and you should make it clear to the user that you can only answer law related questions' },
          { role: 'user', content: userMessage },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}` ,
        },
      }
    );

    const botMessage = response.data.choices[0].message.content;
    res.send({ userMessage, botMessage });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : null,
      config: error.config,
    });
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});