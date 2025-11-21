import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { useState, useEffect, useMemo } from 'react';
import { RoundedBox, CubicBezierLine } from '@react-three/drei';

// --- ASSETS DOMESTIQUES ---

// Le Bureau (Table simple)
function Desk({ position }) {
  return (
    <group position={position}>
      {/* Plateau */}
      <RoundedBox args={[5, 0.1, 2.5]} radius={0.05} position={[0, 2.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#d4a373" roughness={0.6} /> {/* Bois clair */}
      </RoundedBox>
      {/* Pied Gauche */}
      <mesh position={[-2, 1.25, 0]} castShadow>
        <boxGeometry args={[0.1, 2.5, 2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Pied Droit */}
      <mesh position={[2, 1.25, 0]} castShadow>
        <boxGeometry args={[0.1, 2.5, 2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

// La Box Internet (ISP Router)
function ISPBox({ position, onConnect, isConnected }) {
  const portPos = [position[0], position[1] - 0.2, position[2] + 0.3];
  return (
    <group position={position}>
      <RoundedBox args={[0.8, 1.2, 0.4]} radius={0.1}>
        <meshStandardMaterial color="white" />
      </RoundedBox>
      {/* Logo FAI */}
      <mesh position={[0, 0.2, 0.21]}>
        <circleGeometry args={[0.15]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      {/* Led Status */}
      <mesh position={[0, -0.3, 0.21]}>
         <circleGeometry args={[0.02]} />
         <meshBasicMaterial color="#00ff00" />
      </mesh>
      
      {/* Port RJ45 Box */}
      <mesh 
        position={[0, -0.5, 0]} 
        onClick={(e) => { e.stopPropagation(); onConnect('isp-box', portPos); }}
      >
         <boxGeometry args={[0.2, 0.1, 0.1]} />
         <meshStandardMaterial color={isConnected ? "#22c55e" : "#333"} />
      </mesh>
    </group>
  );
}

// La Prise Murale
function WallSocket({ position }) {
    return (
        <group position={position}>
            <mesh>
                <boxGeometry args={[0.3, 0.3, 0.05]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0, 0, 0.03]}>
                <boxGeometry args={[0.15, 0.15, 0.01]} />
                <meshStandardMaterial color="#ddd" />
            </mesh>
        </group>
    )
}

// Ta Machine (Version "Desktop Tower")
function DesktopPC({ position, build, onConnect, isConnected }) {
  const portPos = [position[0], position[1] + 1.5, position[2] - 0.5]; // Derrière le PC
  
  return (
    <group position={position}>
      {/* La Tour */}
      <RoundedBox args={[0.8, 1.8, 1.8]} radius={0.05} position={[0, 0.9, 0]} castShadow>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {/* Vitre latérale */}
      <mesh position={[0.41, 0.9, 0]}>
         <planeGeometry args={[1.6, 0.1]} rotation={[0, 0, Math.PI/2]} />
         <meshBasicMaterial color="#00f3ff" toneMapped={false} /> {/* RGB Strip */}
      </mesh>
      
      {/* Port Réseau (Derrière) */}
      <mesh 
        position={[0, 1.2, -0.91]} 
        onClick={(e) => { e.stopPropagation(); onConnect(`pc-${build._id}`, [position[0], position[1] + 1.2, position[2] - 1.2]); }}
      >
         <boxGeometry args={[0.2, 0.2, 0.05]} />
         <meshStandardMaterial color={isConnected ? "#22c55e" : "#555"} />
      </mesh>
    </group>
  );
}

// Câble Simple
function SimpleCable({ start, end }) {
    // Petit offset pour que le câble ne rentre pas dans le sol direct
    const midPoint = [
        (start[0] + end[0]) / 2,
        Math.min(start[1], end[1]) - 2, // Le câble pend vers le sol
        (start[2] + end[2]) / 2
    ];
    
    return (
        <CubicBezierLine
            start={start}
            end={end}
            midA={midPoint}
            midB={midPoint}
            color="#333"
            lineWidth={2}
        />
    )
}

// --- SCÈNE BUREAU ---

export default function LabScene() {
  const [myBuilds, setMyBuilds] = useState([]);
  const [cables, setCables] = useState([]); 
  const [selectedPort, setSelectedPort] = useState(null); 

  const connectedPorts = useMemo(() => {
      const set = new Set();
      cables.forEach(c => { set.add(c.startId); set.add(c.endId); });
      return set;
  }, [cables]);

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/builds`);
        const data = await res.json();
        setMyBuilds(data);
      } catch (e) { console.error("Err", e); }
    };
    fetchBuilds();
  }, []);

  const handleConnect = (id, pos) => {
      if (selectedPort && selectedPort.id !== id) {
          setCables([...cables, { startId: selectedPort.id, endId: id, startPos: selectedPort.pos, endPos: pos }]);
          setSelectedPort(null);
      } else {
          setSelectedPort({ id, pos });
      }
  };

  return (
    <Canvas camera={{ position: [8, 6, 8], fov: 45 }} shadows>
      <color attach="background" args={['#e0e0e0']} />
      
      {/* Ambiance "Journée" */}
      <Environment preset="apartment" />
      <ambientLight intensity={0.6} />
      <directionalLight position={[-5, 5, 5]} intensity={1} castShadow shadow-mapSize={[1024,1024]} />
      <ContactShadows opacity={0.4} scale={20} blur={2} far={4} resolution={256} color="#000000" />

      <group position={[0, -2, 0]}>
        
        {/* --- LA PIÈCE (THE ROOM) --- */}
        {/* Sol (Parquet) */}
        <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#8d6e63" />
        </mesh>
        {/* Mur Fond */}
        <mesh position={[0, 5, -5]} receiveShadow>
            <planeGeometry args={[20, 10]} />
            <meshStandardMaterial color="#f5f5f5" />
        </mesh>
        {/* Mur Gauche */}
        <mesh position={[-10, 5, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
            <planeGeometry args={[20, 10]} />
            <meshStandardMaterial color="#f0f0f0" />
        </mesh>

        {/* --- LE COIN TECHNIQUE (MURAL) --- */}
        <group position={[-2, 3, -4.9]}>
            <ISPBox onConnect={handleConnect} isConnected={connectedPorts.has('isp-box')} />
            <WallSocket position={[1, -1, 0]} />
            <WallSocket position={[1.5, -1, 0]} />
        </group>

        {/* --- LE BUREAU --- */}
        <Desk position={[0, 0, 0]} />

        {/* --- MES MACHINES --- */}
        {/* On les pose sur le bureau pour commencer */}
        {myBuilds.map((build, i) => (
            <DesktopPC 
                key={build._id} 
                build={build} 
                // On décale chaque tour sur le bureau
                position={[-1.5 + (i * 1.2), 2.6, 0]} 
                onConnect={handleConnect}
                isConnected={connectedPorts.has(`pc-${build._id}`)}
            />
        ))}

        {/* CÂBLES */}
        {cables.map((c, i) => <SimpleCable key={i} start={c.startPos} end={c.endPos} />)}

      </group>

      <OrbitControls makeDefault target={[0, 2, 0]} maxPolarAngle={Math.PI / 2.1} />
      
      {/* UI Instruction */}
      <group position={[0, 5, 0]}>
        {/* On pourrait mettre du texte 3D ici */}
      </group>
    </Canvas>
  );
}