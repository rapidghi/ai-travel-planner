const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const { destination, days, interests } = req.body;

  const prompt = `
    You are an expert travel agent. Create a detailed, day-by-day travel itinerary.
    The user wants to visit ${destination} for ${days} days.
    Their main interests are: ${interests}.
    Provide a structured plan. For each day, suggest a morning, afternoon, and evening activity.
    Also, recommend one restaurant for lunch and one for dinner each day.
    Keep the response concise and easy to read.
  `;

  console.log("Sending prompt to Ollama:", prompt);

  try {
    const ollamaResponse = await axios.post(
      process.env.OLLAMA_API_URL + '/api/generate',
      {
        model: "llama3",
        prompt: prompt,
        stream: false,
      }
    );

    console.log("Received response from Ollama.");

    res.json({ itinerary: ollamaResponse.data.response });

  } catch (error) {
    console.error("Error calling Ollama service:", error.message);
    res.status(500).json({ error: "Failed to communicate with the AI service." });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
