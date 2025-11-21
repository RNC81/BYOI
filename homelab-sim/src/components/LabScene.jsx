import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, MeshReflectorMaterial, ContactShadows, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { useState, useEffect, useMemo } from 'react';
import { RoundedBox, CubicBezierLine } from '@react-three/drei';
import { Vector2 } from 'three';

// --- ASSETS REALISTES ---

function Desk({ position }) {
  return (
    <group position={position}>
      {/* Plateau (Bois Sombre Premium) */}
      <RoundedBox args={[5, 0.15, 2.5]} radius={0.02} position={[0, 2.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial 
          color="#3d2817" 
          roughness={0.2} 
          metalness={0.1} 
        />
      </RoundedBox>
      {/* Pieds (Métal Brossé Industriel) */}
      <mesh position={[-2, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 2.5, 2]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[2, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 2.5, 2]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.8} />
      </mesh>
    </group>
  );
}

function ISPBox({ position, onConnect, isConnected }) {
  const safePos = position || [0, 0, 0];
  const portPos = [safePos[0], safePos[1] - 0.2, safePos[2] + 0.3];
  
  return (
    <group position={safePos}>
      <RoundedBox args={[0.6, 1.0, 0.2]} radius={0.05} castShadow receiveShadow>
        <meshPhysicalMaterial 
            color="#f0f0f0" 
            roughness={0.2} 
            metalness={0.1} 
            clearcoat={1} 
        />
      </RoundedBox>
      {/* LED Status (Glow) */}
      <mesh position={[0, -0.3, 0.11]}>
         <circleGeometry args={[0.02]} />
         <meshBasicMaterial color={isConnected ? "#00ff00" : "#ff3300"} toneMapped={false} />
      </mesh>
      {/* Port RJ45 */}
      <mesh 
        position={[0, -0.5, 0]} 
        onClick={(e) => { e.stopPropagation(); onConnect('isp-box', portPos); }}
      >
         <boxGeometry args={[0.15, 0.05, 0.05]} />
         <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

function DesktopPC({ position, build, onConnect, isConnected }) {
  const portPos = [position[0], position[1] + 1.2, position[2] - 0.9]; 
  
  return (
    <group position={position}>
      {/* La Tour (Métal Sombre + Vitre) */}
      <RoundedBox args={[0.8, 1.8, 1.8]} radius={0.02} position={[0, 0.9, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
      </RoundedBox>
      
      {/* Intérieur RGB (Simulation) */}
      <mesh position={[0.41, 0.9, 0]}>
         <planeGeometry args={[1.6, 0.1]} rotation={[0, 0, Math.PI/2]} />
         <meshBasicMaterial color="#00f3ff" toneMapped={false} />
      </mesh>
      
      {/* Port Réseau */}
      <mesh 
        position={[0, 1.2, -0.91]} 
        onClick={(e) => { e.stopPropagation(); onConnect(`pc-${build._id}`, portPos); }}
      >
         <boxGeometry args={[0.2, 0.2, 0.05]} />
         <meshStandardMaterial color={isConnected ? "#22c55e" : "#333"} emissive={isConnected ? "#22c55e" : "#000"} />
      </mesh>
    </group>
  );
}

// Câble Réaliste (Tube au lieu de ligne)
function RealisticCable({ start, end }) {
    const midPoint = [
        (start[0] + end[0]) / 2,
        Math.min(start[1], end[1]) - 1.5, // Pendouillage naturel
        (start[2] + end[2]) / 2
    ];
    
    return (
        <CubicBezierLine
            start={start}
            end={end}
            midA={midPoint}
            midB={midPoint}
            color="#222" // Câble noir mat
            lineWidth={3}
        />
    )
}

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
    <Canvas camera={{ position: [6, 5, 8], fov: 40 }} shadows dpr={[1, 2]}>
      <color attach="background" args={['#1a1a1a']} />
      
      {/* === ÉCLAIRAGE CINÉMATIQUE === */}
      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      {/* Lumière principale (Soleil) */}
      <directionalLight 
        position={[-5, 8, 5]} 
        intensity={2} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      {/* Lumière de remplissage (Bleutée) */}
      <spotLight position={[10, 10, -5]} intensity={1} color="#b0c4de" />

      {/* Ombres de contact pour ancrer les objets au sol */}
      <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.5} far={10} color="#000000" />

      {/* === EFFETS CAMÉRA (POST-PROCESSING) === */}
      <EffectComposer disableNormalPass>
         {/* Bloom doux pour les LEDs */}
         <Bloom luminanceThreshold={1} mipmapBlur intensity={1.2} radius={0.3} />
         {/* Vignette pour focus central */}
         <Vignette offset={0.3} darkness={0.6} />
         {/* Aberration Chromatique subtile sur les bords (Réalisme lentille) */}
         <ChromaticAberration offset={[0.0005, 0.0005]} />
         {/* Grain très léger pour casser le côté "3D lisse" */}
         <Noise opacity={0.015} />
      </EffectComposer>

      <group position={[0, -2, 0]}>
        
        {/* === LE SOL RÉFLÉCHISSANT (KEY FEATURE) === */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[50, 50]} />
          {/* Ce matériel fait toute la différence : Réflexions floutées */}
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={40} // Force de la réflexion
            roughness={0.6}  // Aspect parquet vernis un peu usé
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#2a2a2a"  // Sol sombre moderne
            metalness={0.5}
          />
        </mesh>

        {/* Murs (Béton banché ou peinture mate) */}
        <mesh position={[0, 10, -10]} receiveShadow>
            <planeGeometry args={[50, 20]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.9} />
        </mesh>
        <mesh position={[-15, 10, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
            <planeGeometry args={[50, 20]} />
            <meshStandardMaterial color="#d0d0d0" roughness={0.9} />
        </mesh>

        {/* --- LE COIN TECHNIQUE --- */}
        <ISPBox position={[-3, 3, -9.8]} onConnect={handleConnect} isConnected={connectedPorts.has('isp-box')} />

        {/* --- LE BUREAU --- */}
        <Desk position={[0, 0, -2]} />

        {/* --- MES MACHINES (Posées avec physique simulée) --- */}
        {myBuilds.map((build, i) => (
            <DesktopPC 
                key={build._id} 
                build={build} 
                // Positionnées sur le bureau
                position={[-1.5 + (i * 1.5), 2.6, -2]} 
                onConnect={handleConnect}
                isConnected={connectedPorts.has(`pc-${build._id}`)}
            />
        ))}

        {/* CÂBLES */}
        {cables.map((c, i) => <RealisticCable key={i} start={c.startPos} end={c.endPos} />)}

      </group>

      <OrbitControls 
        makeDefault 
        target={[0, 2, 0]} 
        maxPolarAngle={Math.PI / 2.1} // Empêche de passer sous le sol
        minDistance={2}
        maxDistance={15}
      />
    </Canvas>
  );
}