#!/bin/bash

# ============================================
# HomeLab Simulator - Complete Project Setup
# Optimized for GitHub Codespaces
# ============================================

echo "🚀 Initializing HomeLab Simulator Project..."

# Create project directory
PROJECT_DIR="homelab-sim"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Create folder structure
echo "📁 Creating directory structure..."
mkdir -p src/components
mkdir -p src/store
mkdir -p src/data
mkdir -p public

# ============================================
# Configuration Files
# ============================================

echo "⚙️  Generating configuration files..."

# package.json
cat << 'EOF' > package.json
{
  "name": "homelab-simulator",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 3000",
    "start": "vite --host 0.0.0.0 --port 3000",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.96.0",
    "@react-three/postprocessing": "^2.16.0",
    "zustand": "^4.5.0",
    "postprocessing": "^6.34.0",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.0.12"
  }
}
EOF

# vite.config.js (Crucial for Codespaces: 0.0.0.0)
cat << 'EOF' > vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
        clientPort: 443 
    }
  }
})
EOF

# tailwind.config.js
cat << 'EOF' > tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'glass-dark': 'rgba(0, 0, 0, 0.6)',
        'glass-light': 'rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
EOF

# postcss.config.js
cat << 'EOF' > postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# index.html
cat << 'EOF' > index.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HomeLab Simulator | Next-Gen PC Builder</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
EOF

# ============================================
# Source Files
# ============================================

echo "📝 Writing source code..."

# src/index.jsx
cat << 'EOF' > src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# src/index.css
cat << 'EOF' > src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#root {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #0a0a0a;
  color: #fff;
}

.glass-panel {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
EOF

# src/App.css
cat << 'EOF' > src/App.css
.app-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.perf-bar-workstation { background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%); }
.perf-bar-gaming { background: linear-gradient(90deg, #ef4444 0%, #f87171 100%); }
.perf-bar-power { background: linear-gradient(90deg, #10b981 0%, #34d399 100%); }
.perf-bar-power.critical { background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%); }
EOF

# src/App.jsx
cat << 'EOF' > src/App.jsx
import React from 'react';
import './App.css';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';

function App() {
  return (
    <div className="app-container" data-testid="app-container">
      <Scene />
      <UIOverlay />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <div className="text-xs text-gray-500">
          <p>Click holographic nodes to add components | Hover installed parts to remove</p>
          <p className="mt-1">Drag to orbit • Scroll to zoom • Right-click to pan</p>
        </div>
      </div>
    </div>
  );
}
export default App;
EOF

# ============================================
# Data & Store
# ============================================

echo "🗄️  Creating database and store..."

# src/data/parts_db.js
cat << 'EOF' > src/data/parts_db.js
export const PARTS_DATABASE = [
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
export const getPartsByCategory = (category) => PARTS_DATABASE.filter(part => part.category === category);
export const getPartById = (id) => PARTS_DATABASE.find(part => part.id === id);
export const getCategories = () => [...new Set(PARTS_DATABASE.map(part => part.category))];
EOF

# src/store/useBuilderStore.js
cat << 'EOF' > src/store/useBuilderStore.js
import { create } from 'zustand';

const useBuilderStore = create((set, get) => ({
  installedParts: [],
  errors: [],
  selectedNode: null,
  systemStats: { totalCost: 0, totalWattage: 0, workstationScore: 0, gamingScore: 0, powerEfficiency: 100 },

  addPart: (part, targetNode) => {
    const state = get();
    const errors = [];

    // Logic compatibility
    if (targetNode) {
      const isValidSlot = validateSlotCompatibility(part, targetNode);
      if (!isValidSlot) {
        errors.push({ id: Date.now(), type: 'slot_mismatch', message: `${part.name} cannot be installed in ${targetNode.type} slot`, severity: 'error' });
        set({ errors });
        return false;
      }
    }

    if (part.type === 'cpu') {
      const motherboard = state.installedParts.find(p => p.type === 'motherboard');
      if (motherboard && motherboard.specs.socket !== part.specs.socket) {
        errors.push({ id: Date.now(), type: 'socket_mismatch', message: `${part.name} (${part.specs.socket}) incompatible with ${motherboard.name}`, severity: 'error' });
        set({ errors });
        return false;
      }
    }

    const exclusiveTypes = ['cpu', 'gpu', 'motherboard', 'case', 'psu'];
    if (exclusiveTypes.includes(part.type)) {
      const existing = state.installedParts.find(p => p.type === part.type);
      if (existing) {
        errors.push({ id: Date.now(), type: 'duplicate', message: `Only one ${part.type} allowed. Remove ${existing.name} first.`, severity: 'warning' });
        set({ errors });
        return false;
      }
    }

    const newPart = { ...part, installedAt: Date.now(), nodeId: targetNode?.id };
    const newInstalledParts = [...state.installedParts, newPart];
    const newStats = calculateSystemStats(newInstalledParts);
    
    const psu = newInstalledParts.find(p => p.type === 'psu');
    if (psu && newStats.totalWattage > psu.specs.max_wattage) {
      errors.push({ id: Date.now(), type: 'power_overload', message: `⚠️ SYSTEM OVERLOAD: ${newStats.totalWattage}W > ${psu.specs.max_wattage}W`, severity: 'critical' });
    }

    set({ installedParts: newInstalledParts, systemStats: newStats, errors, selectedNode: null });
    return true;
  },

  removePart: (partId) => {
    const state = get();
    const newInstalledParts = state.installedParts.filter(p => p.id !== partId);
    const newStats = calculateSystemStats(newInstalledParts);
    set({ installedParts: newInstalledParts, systemStats: newStats, errors: [] });
  },

  selectNode: (node) => set({ selectedNode: node }),
  clearErrors: () => set({ errors: [] }),
  resetBuild: () => set({ installedParts: [], errors: [], selectedNode: null, systemStats: { totalCost: 0, totalWattage: 0, workstationScore: 0, gamingScore: 0, powerEfficiency: 100 } })
}));

function validateSlotCompatibility(part, node) {
  const slotMap = { 'cpu': ['CPU_SOCKET'], 'gpu': ['PCIE_X16'], 'ram': ['RAM_SLOT'], 'motherboard': ['MOTHERBOARD_MOUNT'], 'psu': ['PSU_MOUNT'] };
  const allowedSlots = slotMap[part.type];
  if (!allowedSlots) return true;
  return allowedSlots.includes(node.type);
}

function calculateSystemStats(installedParts) {
  let totalCost = 0; let totalWattage = 0; let workstationScore = 0; let gamingScore = 0;

  installedParts.forEach(part => {
    totalCost += part.price_estimate;
    totalWattage += part.specs.wattage || 0;
    const base = part.specs.performance_score || 0;
    workstationScore += base * (part.specs.workstation_weight || 0);
    gamingScore += base * (part.specs.gaming_weight || 0);
  });

  const psu = installedParts.find(p => p.type === 'psu');
  let powerEfficiency = 100;
  if (psu && psu.specs.max_wattage > 0) {
    const utilization = (totalWattage / psu.specs.max_wattage) * 100;
    powerEfficiency = utilization > 100 ? 0 : utilization > 80 ? 100 - (utilization - 80) * 2 : 100;
  }

  return { totalCost: Math.round(totalCost), totalWattage: Math.round(totalWattage), workstationScore: Math.round(workstationScore), gamingScore: Math.round(gamingScore), powerEfficiency: Math.round(powerEfficiency) };
}

export default useBuilderStore;
EOF

# ============================================
# Components
# ============================================

echo "🎨 Creating React Components..."

# src/components/Scene.jsx
cat << 'EOF' > src/components/Scene.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import PCCase from './PCCase';

function Scene() {
  return (
    <Canvas camera={{ position: [8, 6, 8], fov: 50 }} shadows gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
      <Environment preset="city" background={false} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
      <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={20} blur={2.5} far={10} />
      <PCCase />
      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} minDistance={5} maxDistance={20} enableDamping dampingFactor={0.05} />
      <EffectComposer>
        <Bloom intensity={0.3} luminanceThreshold={0.9} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
export default Scene;
EOF

# src/components/PartNode.jsx
cat << 'EOF' > src/components/PartNode.jsx
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import useBuilderStore from '../store/useBuilderStore';

function PartNode({ node }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const selectNode = useBuilderStore((state) => state.selectNode);
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      meshRef.current.scale.setScalar(node.scale * pulse);
      meshRef.current.material.emissiveIntensity = hovered ? 3 + Math.sin(state.clock.elapsedTime * 4) * 0.5 : 2;
    }
  });
  
  return (
    <group position={node.position}>
      <mesh ref={meshRef} onClick={() => selectNode(node)} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.02, 8, 32]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={1} transparent opacity={0.4} />
      </mesh>
      {hovered && (
        <Text position={[0, 0.8, 0]} fontSize={0.25} color="#00f3ff" anchorX="center" anchorY="middle">
          {node.label}{node.socketType && `\n(${node.socketType})`}
        </Text>
      )}
    </group>
  );
}
export default PartNode;
EOF

# src/components/InstalledPart.jsx
cat << 'EOF' > src/components/InstalledPart.jsx
import { useRef, useState } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import useBuilderStore from '../store/useBuilderStore';

function InstalledPart({ part }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const removePart = useBuilderStore((state) => state.removePart);
  
  const getPosition = () => {
    switch (part.type) {
      case 'motherboard': return [0, -0.5, 0];
      case 'cpu': return [0, 0.3, 0];
      case 'gpu': return [0.5, -0.3, 0.1];
      case 'ram': return [-0.5, 0.3 - (part.nodeId === 'ram_slot_1' ? 0 : 0.2), 0.05];
      case 'psu': return [0, -2, -0.5];
      default: return [0, 0, 0];
    }
  };
  
  const renderGeometry = () => {
    const pos = getPosition();
    const mat = part.material || { color: '#333', metalness: 0.5, roughness: 0.3 };
    
    // Simplified Geometries for MVP
    if(part.type === 'motherboard') return <group position={pos}><RoundedBox args={[3, 0.1, 2.5]} radius={0.05}><meshStandardMaterial {...mat}/></RoundedBox></group>;
    if(part.type === 'cpu') return <group position={pos}><RoundedBox args={[0.6, 0.15, 0.6]} radius={0.02}><meshStandardMaterial {...mat}/></RoundedBox></group>;
    if(part.type === 'gpu') return <group position={pos}><RoundedBox args={[0.5, 0.8, 2.2]} radius={0.05}><meshStandardMaterial {...mat}/></RoundedBox></group>;
    if(part.type === 'ram') return <group position={pos}><RoundedBox args={[0.15, 0.8, 0.05]} radius={0.01}><meshStandardMaterial {...mat}/></RoundedBox></group>;
    if(part.type === 'psu') return <group position={pos}><RoundedBox args={[1.5, 0.8, 1.2]} radius={0.05}><meshStandardMaterial {...mat}/></RoundedBox></group>;
    return null;
  };
  
  return (
    <group ref={meshRef} onClick={() => removePart(part.id)} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {renderGeometry()}
      {hovered && <Text position={[getPosition()[0], getPosition()[1] + 1, getPosition()[2]]} fontSize={0.2} color="white">{part.name}</Text>}
    </group>
  );
}
export default InstalledPart;
EOF

# src/components/PCCase.jsx
cat << 'EOF' > src/components/PCCase.jsx
import { useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import useBuilderStore from '../store/useBuilderStore';
import PartNode from './PartNode';
import InstalledPart from './InstalledPart';

function PCCase() {
  const caseRef = useRef();
  const installedParts = useBuilderStore((state) => state.installedParts);
  const motherboard = installedParts.find(p => p.type === 'motherboard');
  
  const getAvailableNodes = () => {
    const nodes = [];
    if (!motherboard) {
      nodes.push({ id: 'motherboard_slot', type: 'MOTHERBOARD_MOUNT', position: [0, -0.5, 0], label: 'Motherboard', scale: 1.2 });
    }
    if (motherboard) {
      if (!installedParts.find(p => p.type === 'cpu')) nodes.push({ id: 'cpu_socket', type: 'CPU_SOCKET', position: [0, 0.3, 0], label: 'CPU', scale: 0.6, socketType: motherboard.specs.socket });
      if (!installedParts.find(p => p.type === 'gpu')) nodes.push({ id: 'pcie_slot_1', type: 'PCIE_X16', position: [0.5, -0.3, 0.1], label: 'GPU', scale: 0.8 });
      const ramCount = installedParts.filter(p => p.type === 'ram').length;
      if (ramCount < 2) nodes.push({ id: ramCount === 0 ? 'ram_slot_1' : 'ram_slot_2', type: 'RAM_SLOT', position: [-0.5, ramCount === 0 ? 0.3 : 0.1, 0.05], label: 'RAM', scale: 0.4 });
    }
    if (!installedParts.find(p => p.type === 'psu')) nodes.push({ id: 'psu_slot', type: 'PSU_MOUNT', position: [0, -2, -0.5], label: 'PSU', scale: 0.8 });
    return nodes;
  };
  
  return (
    <group>
      <RoundedBox ref={caseRef} args={[4, 5, 2]} radius={0.1} smoothness={4}>
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} clearcoat={0.5} />
      </RoundedBox>
      <mesh position={[-2.1, 0, 0]}>
        <boxGeometry args={[0.1, 4.8, 1.8]} />
        <meshPhysicalMaterial color="#ffffff" metalness={0.1} roughness={0.05} transmission={0.95} transparent opacity={0.3} />
      </mesh>
      {getAvailableNodes().map((node) => <PartNode key={node.id} node={node} />)}
      {installedParts.map((part) => <InstalledPart key={part.id} part={part} />)}
    </group>
  );
}
export default PCCase;
EOF

# src/components/InventoryPanel.jsx
cat << 'EOF' > src/components/InventoryPanel.jsx
import { useState } from 'react';
import { getCategories, getPartsByCategory } from '../data/parts_db';
import useBuilderStore from '../store/useBuilderStore';

function InventoryPanel({ onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('Motherboard');
  const addPart = useBuilderStore((state) => state.addPart);
  const selectedNode = useBuilderStore((state) => state.selectedNode);
  const installedParts = useBuilderStore((state) => state.installedParts);
  
  const categories = getCategories();
  const availableParts = getPartsByCategory(selectedCategory);
  
  const handleAddPart = (part) => {
    let targetNode = selectedNode;
    if (!targetNode) {
      const map = { 'motherboard': 'motherboard_slot', 'cpu': 'cpu_socket', 'gpu': 'pcie_slot_1', 'ram': 'ram_slot_1', 'psu': 'psu_slot' };
      const typeMap = { 'motherboard': 'MOTHERBOARD_MOUNT', 'cpu': 'CPU_SOCKET', 'gpu': 'PCIE_X16', 'ram': 'RAM_SLOT', 'psu': 'PSU_MOUNT' };
      targetNode = { id: map[part.type], type: typeMap[part.type] };
    }
    addPart(part, targetNode);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-panel rounded-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Inventory</h2>
          <button onClick={onClose} className="text-white">✕</button>
        </div>
        <div className="flex gap-2 p-4 border-b border-white/10 overflow-x-auto">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-lg ${selectedCategory === cat ? 'bg-blue-500/30 text-blue-300' : 'bg-white/5'}`}>{cat}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
          {availableParts.map((part) => {
            const installed = installedParts.some(p => p.id === part.id);
            return (
              <div key={part.id} onClick={() => !installed && handleAddPart(part)} className={`glass-panel p-4 ${installed ? 'opacity-50' : 'cursor-pointer hover:bg-white/10'}`}>
                <div className="flex justify-between">
                   <h3 className="font-bold">{part.name}</h3>
                   <span className="text-green-400">${part.price_estimate}</span>
                </div>
                <p className="text-sm text-gray-400">{part.description}</p>
                {!installed && <button className="mt-2 w-full bg-blue-500 py-1 rounded">Add</button>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default InventoryPanel;
EOF

# src/components/UIOverlay.jsx
cat << 'EOF' > src/components/UIOverlay.jsx
import { useEffect, useState } from 'react';
import useBuilderStore from '../store/useBuilderStore';
import InventoryPanel from './InventoryPanel';

function UIOverlay() {
  const { systemStats, errors, installedParts, resetBuild, clearErrors } = useBuilderStore();
  const [showInventory, setShowInventory] = useState(false);
  
  useEffect(() => { if (installedParts.length === 0) setShowInventory(true); }, [installedParts.length]);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between pointer-events-none">
        <div className="glass-panel px-6 py-4 rounded-lg pointer-events-auto">
          <h1 className="text-2xl font-bold">HomeLab Simulator</h1>
        </div>
        <div className="glass-panel px-6 py-4 rounded-lg pointer-events-auto flex gap-8">
           <div><div className="text-xs text-gray-400">COST</div><div className="text-2xl font-bold text-green-400">${systemStats.totalCost}</div></div>
           <div><div className="text-xs text-gray-400">POWER</div><div className="text-2xl font-bold text-blue-400">{systemStats.totalWattage}W</div></div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
        <div className="glass-panel px-8 py-6 rounded-lg max-w-4xl mx-auto pointer-events-auto space-y-4">
            <h2 className="text-sm font-bold text-gray-300">PERFORMANCE PROFILE</h2>
            <div>
                <div className="flex justify-between text-sm text-gray-300"><span>Workstation</span><span>{systemStats.workstationScore}</span></div>
                <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden"><div className="perf-bar-workstation h-full transition-all duration-500" style={{width: `${Math.min(systemStats.workstationScore, 100)}%`}}></div></div>
            </div>
            <div>
                <div className="flex justify-between text-sm text-gray-300"><span>Gaming</span><span>{systemStats.gamingScore}</span></div>
                <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden"><div className="perf-bar-gaming h-full transition-all duration-500" style={{width: `${Math.min(systemStats.gamingScore, 100)}%`}}></div></div>
            </div>
        </div>
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
        <button onClick={() => setShowInventory(!showInventory)} className="glass-panel p-3 rounded-lg hover:bg-white/10">📦 Inventory</button>
        <button onClick={resetBuild} className="glass-panel p-3 rounded-lg text-red-400 hover:bg-red-500/20">↺ Reset</button>
      </div>

      {errors.length > 0 && (
        <div className="absolute top-24 right-6 w-96 space-y-2 pointer-events-auto">
          {errors.map((err) => (
            <div key={err.id} className={`glass-panel p-3 rounded-lg border-l-4 ${err.severity === 'critical' ? 'border-red-500' : 'border-yellow-500'}`}>
               <div className="flex justify-between"><span>{err.message}</span><button onClick={clearErrors}>✕</button></div>
            </div>
          ))}
        </div>
      )}
      {showInventory && <InventoryPanel onClose={() => setShowInventory(false)} />}
    </>
  );
}
export default UIOverlay;
EOF

echo "🎉 Files created successfully."
echo "📦 Installing dependencies (this might take a minute)..."
npm install

echo ""
echo "✅ SETUP COMPLETE!"
echo "👉 To start the app, run: npm run dev"
echo "👉 Then click 'Open in Browser' when the popup appears."