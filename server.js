// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/generate-plan', async (req, res) => {
  const {
    tripName,
    depart,
    destination,
    startDate,
    endDate,
    description,
    peopleCount,
    budget,
  } = req.body;

  const prompt = `
Tu es un expert en planification de voyages. Génère un plan détaillé pour un voyage nommé "${tripName}" qui part de "${depart}" vers "${destination}" du ${startDate} au ${endDate}, avec ${peopleCount} personnes, un budget de ${budget}€, et les détails suivants : "${description}". Fournis un programme jour par jour, des suggestions d’activités, repas, transport, et recommandations d'hébergement.`;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral', // or another model you have installed (like llama2, gemma, etc.)
      prompt,
      stream: false
    });

    res.json({ plan: response.data.response });
  } catch (error) {
    console.error('Erreur Ollama :', error);
    res.status(500).json({ error: 'Erreur lors de la génération du plan avec Ollama' });
  }
});

app.listen(5000, () => {
  console.log('✅ Serveur AI démarré sur http://localhost:5000');
});
