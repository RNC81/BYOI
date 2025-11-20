const mongoose = require('mongoose');

const BuildSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Ex: "Serveur Plex", "PC Gaming"
  createdAt: { type: Date, default: Date.now },
  totalCost: Number,
  totalWattage: Number,
  // On stocke juste les IDs des pièces et leur position (nodeId)
  parts: [{
    partId: String, // L'ID de la pièce (ex: "cpu_001")
    nodeId: String, // Où elle est installée (ex: "cpu_socket")
    installedAt: Date
  }]
});

module.exports = mongoose.model('Build', BuildSchema);