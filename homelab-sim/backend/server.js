require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Part = require('./models/Part');
const Build = require('./models/Build'); // <--- Import du nouveau modèle

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const PARTS_DATA = [
  {
    id: 'case_001',
    name: 'ProTower Mesh ATX',
    type: 'case',
    category: 'Case',
    specs: { form_factor: 'ATX', wattage: 0, max_gpu_length: 320, performance_score: 0 },
    visual_nodes: [{ id: 'motherboard_slot', type: 'MOTHERBOARD_MOUNT', position: [0, -0.5, 0] }],
    price_estimate: 89,
    material: { color: '#2a2a2a', metalness: 0.8, roughness: 0.1 },
    description: 'Premium tempered glass ATX case'
  },
  {
    id: 'mobo_001',
    name: 'ASUS ROG Strix Z790',
    type: 'motherboard',
    category: 'Motherboard',
    specs: { socket: 'LGA1700', chipset: 'Z790', pcie_slots: ['PCIE_X16', 'PCIE_X4'], ram_slots: 4, wattage: 80, performance_score: 10 },
    visual_nodes: [
      { id: 'cpu_socket', type: 'CPU_SOCKET', socket_type: 'LGA1700', position: [0, 0.3, 0] },
      { id: 'pcie_slot_1', type: 'PCIE_X16', position: [0.2, -0.2, 0.1] },
      { id: 'ram_slot_1', type: 'RAM_SLOT', position: [-0.3, 0.2, 0.05] },
      { id: 'ram_slot_2', type: 'RAM_SLOT', position: [-0.3, 0.1, 0.05] }
    ],
    price_estimate: 349,
    material: { color: '#1a1a1a', metalness: 0.1, roughness: 0.8 },
    description: 'High-end ATX motherboard DDR5'
  },
  {
    id: 'cpu_001',
    name: 'Intel Core i9-13900K',
    type: 'cpu',
    category: 'CPU',
    specs: { socket: 'LGA1700', cores: 24, threads: 32, base_clock: 3.0, boost_clock: 5.8, wattage: 253, performance_score: 95, workstation_weight: 1.0, gaming_weight: 0.3 },
    visual_nodes: [],
    price_estimate: 589,
    material: { color: '#333333', metalness: 0.2, roughness: 0.2 },
    description: 'Flagship 24-core processor'
  },
  {
    id: 'cpu_002',
    name: 'AMD Ryzen 7 7800X3D',
    type: 'cpu',
    category: 'CPU',
    specs: { socket: 'AM5', cores: 8, threads: 16, base_clock: 4.2, boost_clock: 5.0, wattage: 120, performance_score: 85, workstation_weight: 0.7, gaming_weight: 0.5 },
    visual_nodes: [],
    price_estimate: 449,
    material: { color: '#444444', metalness: 0.2, roughness: 0.2 },
    description: '3D V-Cache gaming champion'
  },
  {
    id: 'gpu_001',
    name: 'NVIDIA RTX 4090',
    type: 'gpu',
    category: 'GPU',
    specs: { slot_type: 'PCIE_X16', vram: 24, length: 304, wattage: 450, performance_score: 100, workstation_weight: 0.4, gaming_weight: 1.0 },
    visual_nodes: [],
    price_estimate: 1599,
    material: { color: '#1a1a1a', metalness: 0.5, roughness: 0.3 },
    description: 'Flagship graphics card'
  },
  {
    id: 'gpu_002',
    name: 'AMD Radeon RX 7900 XTX',
    type: 'gpu',
    category: 'GPU',
    specs: { slot_type: 'PCIE_X16', vram: 24, length: 287, wattage: 355, performance_score: 90, workstation_weight: 0.3, gaming_weight: 1.0 },
    visual_nodes: [],
    price_estimate: 999,
    material: { color: '#2a2a2a', metalness: 0.5, roughness: 0.3 },
    description: 'High-performance RDNA3'
  },
  {
    id: 'ram_001',
    name: 'Corsair Vengeance DDR5 32GB',
    type: 'ram',
    category: 'RAM',
    specs: { slot_type: 'RAM_SLOT', capacity: 32, speed: 6000, wattage: 10, performance_score: 20, workstation_weight: 0.5, gaming_weight: 0.3 },
    visual_nodes: [],
    price_estimate: 149,
    material: { color: '#000000', metalness: 0.6, roughness: 0.2 },
    description: 'High-speed DDR5 memory'
  },
  {
    id: 'ram_002',
    name: 'G.Skill Trident Z5 64GB',
    type: 'ram',
    category: 'RAM',
    specs: { slot_type: 'RAM_SLOT', capacity: 64, speed: 6400, wattage: 15, performance_score: 30, workstation_weight: 0.6, gaming_weight: 0.2 },
    visual_nodes: [],
    price_estimate: 279,
    material: { color: '#1a1a1a', metalness: 0.7, roughness: 0.15 },
    description: 'Premium 64GB DDR5'
  },
  {
    id: 'psu_001',
    name: 'Corsair RM850x',
    type: 'psu',
    category: 'PSU',
    specs: { max_wattage: 850, efficiency: '80+ Gold', wattage: 0, performance_score: 0 },
    visual_nodes: [],
    price_estimate: 139,
    material: { color: '#2a2a2a', metalness: 0.8, roughness: 0.1 },
    description: '850W modular power supply'
  },
  {
    id: 'psu_002',
    name: 'Seasonic Prime TX-1000',
    type: 'psu',
    category: 'PSU',
    specs: { max_wattage: 1000, efficiency: '80+ Titanium', wattage: 0, performance_score: 0 },
    visual_nodes: [],
    price_estimate: 289,
    material: { color: '#1a1a1a', metalness: 0.9, roughness: 0.05 },
    description: '1000W premium titanium PSU'
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// === ROUTES PARTS (Existantes) ===
app.get('/api/parts', async (req, res) => {
  try {
    const parts = await Part.find();
    res.json(parts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === NOUVELLES ROUTES : BUILDS (Sauvegarde) ===

// 1. Sauvegarder une config
app.post('/api/builds', async (req, res) => {
  try {
    const { name, parts, stats } = req.body;
    
    // On ne garde que l'essentiel pour la DB
    const simplifiedParts = parts.map(p => ({
      partId: p.id,
      nodeId: p.nodeId,
      installedAt: p.installedAt
    }));

    const newBuild = new Build({
      name: name || "Untitled Build",
      parts: simplifiedParts,
      totalCost: stats.totalCost,
      totalWattage: stats.totalWattage
    });

    const savedBuild = await newBuild.save();
    res.status(201).json(savedBuild);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. Récupérer toutes les machines de l'utilisateur
app.get('/api/builds', async (req, res) => {
  try {
    const builds = await Build.find().sort({ createdAt: -1 });
    res.json(builds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Charger une build spécifique (avec les détails des pièces)
app.get('/api/builds/:id', async (req, res) => {
  try {
    const build = await Build.findById(req.params.id);
    if (!build) return res.status(404).json({ message: 'Build not found' });
    
    // On doit "réhydrater" les pièces (retrouver leurs specs complètes via l'ID)
    // Note: Dans une vraie app pro, on utiliserait .populate() de Mongoose, 
    // mais ici on fait simple car nos IDs sont des Strings custom.
    
    const fullParts = [];
    for (const item of build.parts) {
      const partDetails = await Part.findOne({ id: item.partId });
      if (partDetails) {
        fullParts.push({
          ...partDetails.toObject(),
          nodeId: item.nodeId,
          installedAt: item.installedAt
        });
      }
    }

    res.json({ build, fullParts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🚀 ROUTE SPÉCIALE POUR LE SEED VIA RENDER
// Appeler cette route via le navigateur : https://ton-api.onrender.com/api/seed
app.get('/api/seed', async (req, res) => {
  try {
    // 1. Vider la table
    await Part.deleteMany({});
    // 2. Remplir
    await Part.insertMany(PARTS_DATA);
    res.json({ 
      success: true, 
      message: "Database seeded successfully from Render!", 
      count: PARTS_DATA.length 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});