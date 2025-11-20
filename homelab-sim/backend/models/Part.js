const mongoose = require('mongoose');

const PartSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  
  // Ici aussi, pour être sûr, on utilise la notation objet explicite
  type: { type: String, required: true }, 
  
  category: { type: String, required: true },
  specs: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // LA CORRECTION EST ICI 👇
  visual_nodes: [{
    id: String,
    type: { type: String }, // On dit explicitement que le champ s'appelle "type"
    position: [Number],
    socket_type: String
  }],
  
  price_estimate: { type: Number, required: true },
  material: {
    color: String,
    metalness: Number,
    roughness: Number
  },
  description: String
});

module.exports = mongoose.model('Part', PartSchema);