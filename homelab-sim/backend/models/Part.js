const mongoose = require('mongoose');

const PartSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // On garde ton ID string pour l'instant
  name: { type: String, required: true },
  type: { type: String, required: true }, // cpu, gpu, case, etc.
  category: { type: String, required: true },
  specs: {
    type: Map,
    of: mongoose.Schema.Types.Mixed // Permet de stocker des nombres ou des strings
  },
  visual_nodes: [{
    id: String,
    type: String,
    position: [Number], // [x, y, z]
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
