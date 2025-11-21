import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Stage, PresentationControls, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox, CubicBezierLine } from '@react-three/drei';

// --- COMPOSANTS VISUELS ---

// Le Câble Dynamique (Courbe de Bézier)
function NetworkCable({ start, end, color = "#22c55e" }) {
  // Calcul des points de contrôle pour faire une belle courbe qui pendouille un peu
  const midY = Math.min(start[1], end[1]) - 0.5; // Le câble descend un peu
  const mid = [
    (start[0] + end[0]) / 2,
    midY,
    (start[2] + end[2]) / 2 + 0.5 // Il ressort vers l'utilisateur
  ];

  return (
    <CubicBezierLine
      start={start}
      end={end}
      midA={[start[0], start[1], start[2] + 0.5]} // Point de tension A
      midB={[end[0], end[1], end[2] + 0.5]}       // Point de tension B
      color={color}
      lineWidth={3}
      dashed={false}
    />
  );
}

// Un Port RJ45 Cliquable
function Port({ position, id, onConnect, isSelected, isConnected }) {
  const [hovered, setHover] = useState(false);
  
  return (
    <group position={position}>
      <mesh 
        onClick={(e) => { e.stopPropagation(); onConnect(id, position); }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial 
          color={isConnected ? "#22c55e" : isSelected ? "#fbbf24" : hovered ? "#3b82f6" : "#111"} 
          emissive={isConnected ? "#22c55e" : isSelected ? "#fbbf24" : "#000"}
          emissiveIntensity={isConnected || isSelected ? 2 : 0}
        />
      </mesh>
      {/* Petite lumière d'activité */}
      <mesh position={[0, 0.08, 0]}>
         <planeGeometry args={[0.15, 0.02]} />
         <meshBasicMaterial color={isConnected ? "#22c55e" : "#333"} />
      </mesh>
    </group>
  );
}

// Une Machine (Représentation Rackable)
function RackServer({ position, build, uHeight = 2, onPortSelect, selectedPort, connectedPorts }) {
  // On génère un port unique pour cette machine (virtuellement à l'arrière ou devant)
  const portId = `server-${build._id}`;
  // Position relative du port sur la façade
  const portPos = [0.8, 0, 1.05]; 
  // Position absolue dans le monde (pour le câble)
  const absolutePortPos = [
    position[0] + portPos[0], 
    position[1] + portPos[1], 
    position[2] + portPos[2]
  ];

  return (
    <group position={position}>
      {/* Châssis Serveur */}
      <RoundedBox args={[3.8, uHeight * 0.4, 2]} radius={0.05}>
        <meshPhysicalMaterial 
          color="#222" 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={1}
        />
      </RoundedBox>
      
      {/* Façade Avant (Grille) */}
      <mesh position={[0, 0, 1.01]}>
         <planeGeometry args={[3.6, uHeight * 0.35]} />
         <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>

      {/* Nom du Serveur */}
      {/* (Texte 3D supprimé pour perf, on simule un écran LCD) */}
      <mesh position={[-1, 0, 1.02]}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color="#00f3ff" />
      </mesh>

      {/* Port Réseau de la machine */}
      <Port 
        position={portPos} 
        id={portId} 
        onConnect={() => onPortSelect(portId, absolutePortPos)}
        isSelected={selectedPort === portId}
        isConnected={connectedPorts.has(portId)}
      />
    </group>
  );
}

// Le Switch Réseau (24 Ports)
function NetworkSwitch({ position, onPortSelect, selectedPort, connectedPorts }) {
  const ports = [];
  for(let i=0; i<12; i++) {
     // Ligne du haut
     ports.push({ id: `sw-top-${i}`, pos: [-1.5 + (i * 0.27), 0.1, 0.76] });
     // Ligne du bas
     ports.push({ id: `sw-bot-${i}`, pos: [-1.5 + (i * 0.27), -0.1, 0.76] });
  }

  return (
    <group position={position}>
      {/* Boîtier Switch */}
      <RoundedBox args={[3.8, 0.5, 1.5]} radius={0.02}>
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.4} />
      </RoundedBox>
      {/* Façade bleue Cisco */}
      <mesh position={[0, 0, 0.76]}>
         <boxGeometry args={[3.8, 0.5, 0.01]} />
         <meshStandardMaterial color="#004080" />
      </mesh>

      {/* Génération des 24 ports */}
      {ports.map((p) => {
          const absPos = [
            position[0] + p.pos[0], 
            position[1] + p.pos[1], 
            position[2] + p.pos[2]
          ];
          return (
            <Port 
                key={p.id} 
                position={p.pos} 
                id={p.id} 
                onConnect={() => onPortSelect(p.id, absPos)}
                isSelected={selectedPort === p.id}
                isConnected={connectedPorts.has(p.id)}
            />
          );
      })}
    </group>
  );
}

// Le Rack (Armoire)
function ServerRack({ children }) {
  return (
    <group>
      {/* Montants Verticaux */}
      <mesh position={[-2, 4, 1]} castShadow><boxGeometry args={[0.1, 8, 0.1]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[2, 4, 1]} castShadow><boxGeometry args={[0.1, 8, 0.1]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[-2, 4, -1]} castShadow><boxGeometry args={[0.1, 8, 0.1]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[2, 4, -1]} castShadow><boxGeometry args={[0.1, 8, 0.1]} /><meshStandardMaterial color="#111" /></mesh>
      
      {/* Toit et Sol */}
      <mesh position={[0, 8, 0]}><boxGeometry args={[4.2, 0.1, 2.2]} /><meshStandardMaterial color="#222" /></mesh>
      <mesh position={[0, 0, 0]}><boxGeometry args={[4.2, 0.1, 2.2]} /><meshStandardMaterial color="#222" /></mesh>

      {children}
    </group>
  );
}

// --- SCÈNE PRINCIPALE ---

export default function LabScene() {
  const [myBuilds, setMyBuilds] = useState([]);
  
  // État du Câblage
  const [cables, setCables] = useState([]); // { startId, endId, startPos, endPos }
  const [selectedPort, setSelectedPort] = useState(null); // { id, pos }
  
  // Set pour savoir quels ports sont occupés (pour allumer les LEDs)
  const connectedPorts = useMemo(() => {
      const set = new Set();
      cables.forEach(c => { set.add(c.startId); set.add(c.endId); });
      return set;
  }, [cables]);

  // Chargement des données
  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/builds`);
        const data = await res.json();
        setMyBuilds(data);
      } catch (e) { console.error("Err builds", e); }
    };
    fetchBuilds();
  }, []);

  // LOGIQUE DE CONNEXION
  const handlePortSelect = (portId, position) => {
    // Si on clique sur un port déjà connecté, on ne fait rien (ou on pourrait déconnecter)
    if (connectedPorts.has(portId)) return;

    if (!selectedPort) {
      // 1. Premier clic : On sélectionne le départ
      setSelectedPort({ id: portId, pos: position });
    } else {
      // 2. Deuxième clic : On valide la connexion
      if (selectedPort.id === portId) {
          // Annuler si on clique sur le même
          setSelectedPort(null);
          return;
      }

      // Créer le câble
      setCables([...cables, {
          startId: selectedPort.id,
          endId: portId,
          startPos: selectedPort.pos,
          endPos: position
      }]);
      
      // Reset
      setSelectedPort(null);
    }
  };

  return (
    <Canvas camera={{ position: [6, 5, 8], fov: 45 }} shadows dpr={[1, 2]}>
      <color attach="background" args={['#050505']} />
      
      {/* Environnement Pro */}
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      
      {/* Post-Processing pour le look "Jeu Vidéo" */}
      <EffectComposer disableNormalPass>
         <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
         <Vignette eskil={false} offset={0.1} darkness={1.1} />
         <Noise opacity={0.02} />
      </EffectComposer>

      <group position={[0, -2, 0]}>
        {/* Sol Grille */}
        <Grid position={[0, 0, 0]} args={[20, 20]} cellColor="#333" sectionColor="#111" fadeDistance={20} infiniteGrid />

        <ServerRack>
            {/* LE SWITCH (Placé en haut du rack, position U15 environ) */}
            <NetworkSwitch 
                position={[0, 6, 0.2]} 
                onPortSelect={handlePortSelect} 
                selectedPort={selectedPort?.id}
                connectedPorts={connectedPorts}
            />

            {/* LES SERVEURS (Empilés dynamiquement) */}
            {myBuilds.map((build, index) => (
                <RackServer 
                    key={build._id}
                    build={build}
                    position={[0, 1 + (index * 1.5), 0]} // On les empile
                    onPortSelect={handlePortSelect}
                    selectedPort={selectedPort?.id}
                    connectedPorts={connectedPorts}
                />
            ))}
        </ServerRack>

        {/* LES CÂBLES */}
        {cables.map((cable, i) => (
            <NetworkCable key={i} start={cable.startPos} end={cable.endPos} />
        ))}
        
        {/* CÂBLE FANTÔME (Prévisualisation quand on a cliqué sur un port) */}
        {/* (Pour une V2, un peu complexe à faire suivre la souris en React pur sans lag) */}
      </group>

      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2} minDistance={2} maxDistance={15} target={[0, 3, 0]} />
    </Canvas>
  );
}