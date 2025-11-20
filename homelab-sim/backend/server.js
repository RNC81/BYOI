require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Part = require('./models/Part');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Permet au Frontend (port 3000) de parler au Backend (port 5000)
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.get('/api/parts', async (req, res) => {
  try {
    const parts = await Part.find();
    res.json(parts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour ajouter une pièce manuellement (optionnel)
app.post('/api/parts', async (req, res) => {
  const part = new Part(req.body);
  try {
    const newPart = await part.save();
    res.status(201).json(newPart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
