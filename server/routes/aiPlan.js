// server/routes/aiPlan.js
import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/generate-plan', async (req, res) => {
  const { tripName, depart, destination, startDate, endDate, description, peopleCount, budget } = req.body;

  const prompt = `
Create a detailed holiday plan for the following trip:
- Name: ${tripName}
- From: ${depart} to ${destination}
- Dates: ${startDate} to ${endDate}
- Description: ${description}
- People: ${peopleCount}
- Budget: ${budget} EUR

Include daily itinerary, estimated costs, activity suggestions, and travel tips.
`;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });
    const plan = response.data.choices[0].message.content;
    res.json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate plan' });
  }
});

export default router;
