const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import the getBotResponse function from bot.js
const { getBotResponse } = require('./bot');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post('/api/sendMessage', (req, res) => {
  console.log("Received request:", req.body);
  const userInput = req.body.message;

  // Call the generateBotResponse function to get the bot's response
  const botResponse = getBotResponse(userInput);

  // Create a response object with the bot's message
  const response = {
    message: botResponse
  };

  // Send the response back to the client
  res.json(response);
  console.log('Bot response:', botResponse);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
