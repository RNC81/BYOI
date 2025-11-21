import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stage, Grid } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { RoundedBox } from '@react-three/drei';

// Un composant simple pour représenter une machine sauvegardée (Mode "Miniature")
function MiniServer({ position, name, color = "#333" }) {
  return (
    <group position={position}>
      {/* Tour */}
      <RoundedBox args={[1, 2, 2]} radius={0.1}>
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </RoundedBox>
      {/* Led statut */}
      <mesh position={[0, 0.8, 1.05]}>
        <circleGeometry args={[0.05]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      {/* Label flottant */}
      {/* On ajoutera du texte HTML ici plus tard */}
    </group>
  );
}

function NetworkSwitch({ position }) {
  return (
    <group position={position}>
      <RoundedBox args={[4, 0.5, 1.5]} radius={0.05}>
        <meshStandardMaterial color="#054fb8" roughness={0.4} /> {/* Bleu Cisco classique */}
      </RoundedBox>
      {/* Ports RJ45 (Simulation visuelle) */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[-1.5 + (i * 0.45), 0, 0.76]}>
          <boxGeometry args={[0.3, 0.2, 0.05]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
    </group>
  );
}

export default function LabScene() {
  const [myBuilds, setMyBuilds] = useState([]);

  // Charger les builds sauvegardés depuis l'API
  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/builds`);
        const data = await res.json();
        setMyBuilds(data);
      } catch (e) {
        console.error("Erreur chargement builds", e);
      }
    };
    fetchBuilds();
  }, []);

  return (
    <Canvas camera={{ position: [8, 8, 8], fov: 50 }} shadows>
      <color attach="background" args={['#050505']} />
      <Environment preset="city" />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      {/* Sol Grille Sci-Fi */}
      <Grid position={[0, -0.1, 0]} args={[20, 20]} cellColor="#222" sectionColor="#00f3ff" fadeDistance={15} />

      <group position={[0, 0, 0]}>
        {/* La Table / Le Rack */}
        <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
           <planeGeometry args={[15, 10]} />
           <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* L'équipement Central : Le Switch */}
        <NetworkSwitch position={[0, 0.25, 0]} />

        {/* Mes Machines (Disposées en arc de cercle ou grille) */}
        {myBuilds.map((build, index) => {
          // Petit algo pour les placer autour du switch
          const angle = (index / myBuilds.length) * Math.PI * 2;
          const radius = 4;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <group key={build._id} position={[x, 1, z]} lookAt={[0, 0, 0]}>
               <MiniServer position={[0, 0, 0]} name={build.name} />
               {/* CÂBLE VIRTUEL (Ligne simple pour l'instant) */}
               {/* On fera des courbes de Bézier plus tard */}
            </group>
          );
        })}
      </group>

      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.2} />
    </Canvas>
  );
}