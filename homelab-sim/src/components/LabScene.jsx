import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useState, useEffect, useMemo, useRef } from 'react';
import { RoundedBox, CubicBezierLine } from '@react-three/drei';
import * as THREE from 'three';

// --- COMPOSANTS D'ANIMATION ---

// Le paquet de données qui voyage (La petite boule de lumière)
function DataPacket({ start, end, color = "#00ff00", speed = 2 }) {
    const meshRef = useRef();
    const [offset, setOffset] = useState(0);

    // Calcul de la courbe de trajectoire (identique au câble)
    const curve = useMemo(() => {
        const midPoint = new THREE.Vector3(
            (start[0] + end[0]) / 2,
            Math.min(start[1], end[1]) - 1, // Le "mou" du câble
            (start[2] + end[2]) / 2
        );
        return new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(...start),
            midPoint,
            new THREE.Vector3(...end)
        );
    }, [start, end]);

    useFrame((state, delta) => {
        // Faire avancer le paquet
        if (meshRef.current) {
            let newOffset = offset + (delta * speed);
            if (newOffset > 1) newOffset = 0; // Boucle
            setOffset(newOffset);
            
            const point = curve.getPoint(newOffset);
            meshRef.current.position.set(point.x, point.y, point.z);
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.03]} />
            <meshBasicMaterial color={color} toneMapped={false} />
            <pointLight intensity={0.5} distance={0.5} color={color} />
        </mesh>
    );
}

// --- ASSETS ---

function Desk({ position }) {
  return (
    <group position={position}>
      <RoundedBox args={[4.5, 0.1, 2.2]} radius={0.02} position={[0, 2.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e6c2a0" roughness={0.6} metalness={0.0} />
      </RoundedBox>
      <mesh position={[-1.8, 1.25, 0]} castShadow receiveShadow><boxGeometry args={[0.1, 2.5, 1.8]} /><meshStandardMaterial color="#fff" roughness={0.8} /></mesh>
      <mesh position={[1.8, 1.25, 0]} castShadow receiveShadow><boxGeometry args={[0.1, 2.5, 1.8]} /><meshStandardMaterial color="#fff" roughness={0.8} /></mesh>
    </group>
  );
}

function ISPBox({ position, onConnect, isConnected }) {
  const safePos = position || [0, 0, 0];
  const portPos = [safePos[0], safePos[1] - 0.2, safePos[2] + 0.3];
  
  return (
    <group position={safePos}>
      <RoundedBox args={[0.5, 0.8, 0.2]} radius={0.05} castShadow receiveShadow>
        <meshPhysicalMaterial color="#fafafa" roughness={0.2} metalness={0.1} clearcoat={0.8} />
      </RoundedBox>
      <mesh position={[0, 0.2, 0.11]}><circleGeometry args={[0.05]} /><meshBasicMaterial color="#ff3333" /></mesh>
      <mesh position={[0, -0.3, 0]} onClick={(e) => { e.stopPropagation(); onConnect('isp-box', portPos); }}>
         <boxGeometry args={[0.1, 0.05, 0.05]} />
         <meshStandardMaterial color={isConnected ? "#22c55e" : "#333"} />
      </mesh>
    </group>
  );
}

// NOUVEAU : Switch de Bureau 8 Ports
function DesktopSwitch({ position, onConnect, connectedPorts }) {
    // Générer 8 ports (4 devant, 4 derrière pour simplifier ou tous derrière)
    // Faisons simple : 5 ports à l'arrière
    const ports = Array.from({ length: 5 }).map((_, i) => ({
        id: `switch-p${i}`,
        pos: [position[0] - 0.3 + (i * 0.15), position[1], position[2] - 0.16]
    }));

    return (
        <group position={position}>
            {/* Boîtier Métal Bleu Nuit */}
            <RoundedBox args={[0.8, 0.2, 0.3]} radius={0.02} castShadow receiveShadow>
                <meshStandardMaterial color="#1e3a8a" metalness={0.6} roughness={0.3} />
            </RoundedBox>
            {/* LEDs Activité Devant */}
            {ports.map((_, i) => (
                 <mesh key={i} position={[-0.3 + (i * 0.15), 0.05, 0.151]}>
                    <circleGeometry args={[0.015]} />
                    <meshBasicMaterial color={connectedPorts.has(`switch-p${i}`) ? "#00ff00" : "#222"} />
                 </mesh>
            ))}
            {/* Ports Arrière Cliquables */}
            {ports.map((p) => (
                <mesh 
                    key={p.id}
                    position={[p.pos[0] - position[0], 0, -0.15]} 
                    onClick={(e) => { e.stopPropagation(); onConnect(p.id, p.pos); }}
                >
                    <boxGeometry args={[0.1, 0.1, 0.02]} />
                    <meshStandardMaterial color={connectedPorts.has(p.id) ? "#22c55e" : "#111"} />
                </mesh>
            ))}
        </group>
    )
}

function DesktopPC({ position, build, onConnect, isConnected }) {
  const portPos = [position[0], position[1] + 1.2, position[2] - 0.9]; 
  return (
    <group position={position}>
      <RoundedBox args={[0.8, 1.8, 1.8]} radius={0.02} position={[0, 0.9, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0.41, 0.9, 0]}>
         <planeGeometry args={[1.6, 0.1]} rotation={[0, 0, Math.PI/2]} />
         <meshBasicMaterial color="#a855f7" toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.2, -0.91]} onClick={(e) => { e.stopPropagation(); onConnect(`pc-${build._id}`, portPos); }}>
         <boxGeometry args={[0.2, 0.2, 0.05]} />
         <meshStandardMaterial color={isConnected ? "#22c55e" : "#333"} emissive={isConnected ? "#22c55e" : "#000"} />
      </mesh>
    </group>
  );
}

function CableWithData({ start, end }) {
    const midPoint = [
        (start[0] + end[0]) / 2,
        Math.min(start[1], end[1]) - 1,
        (start[2] + end[2]) / 2
    ];
    
    return (
        <group>
            {/* Le Câble physique */}
            <CubicBezierLine
                start={start}
                end={end}
                midA={midPoint}
                midB={midPoint}
                color="#333"
                lineWidth={2}
            />
            {/* Le Paquet de données qui circule */}
            <DataPacket start={start} end={end} />
        </group>
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
    <Canvas camera={{ position: [6, 5, 6], fov: 50 }} shadows dpr={[1, 2]}>
      <color attach="background" args={['#dcdcdc']} />
      
      <Environment preset="apartment" environmentIntensity={0.5} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[-2, 5, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} color="#fff0dd" />
      <spotLight position={[2, 6, 0]} angle={0.5} penumbra={0.5} intensity={2} castShadow color="#ffeebb" />
      <ContactShadows opacity={0.4} scale={15} blur={2.5} far={2} />

      <EffectComposer disableNormalPass>
         <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.8} radius={0.4} />
         <Vignette offset={0.5} darkness={0.4} />
      </EffectComposer>

      <group position={[0, -2, 0]}>
        
        {/* DÉCOR */}
        <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow><planeGeometry args={[15, 15]} /><meshStandardMaterial color="#8d6e63" roughness={0.8} /></mesh>
        <mesh position={[0, 5, -4]} receiveShadow><planeGeometry args={[15, 10]} /><meshStandardMaterial color="#fdfbf7" /></mesh>
        <mesh position={[-7.5, 5, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow><planeGeometry args={[15, 10]} /><meshStandardMaterial color="#fdfbf7" /></mesh>
        <mesh position={[0, 0.1, -3.95]}><boxGeometry args={[15, 0.2, 0.1]} /><meshStandardMaterial color="white" /></mesh>

        {/* ÉQUIPEMENTS */}
        
        {/* Box FAI au mur */}
        <ISPBox position={[-1.5, 2, -3.9]} onConnect={handleConnect} isConnected={connectedPorts.has('isp-box')} />

        {/* Bureau */}
        <Desk position={[0, 0, -1]} />

        {/* NOUVEAU : Switch 5 ports sur le bureau */}
        <DesktopSwitch 
            position={[1.5, 2.65, -1]} 
            onConnect={handleConnect} 
            connectedPorts={connectedPorts} 
        />

        {/* Mes PC (Dynamiques) */}
        {myBuilds.map((build, i) => (
            <DesktopPC 
                key={build._id} 
                build={build} 
                position={[-1.2 + (i * 1.2), 2.6, -1]} 
                onConnect={handleConnect}
                isConnected={connectedPorts.has(`pc-${build._id}`)}
            />
        ))}

        {/* CÂBLES AVEC DATA */}
        {cables.map((c, i) => <CableWithData key={i} start={c.startPos} end={c.endPos} />)}

      </group>

      <OrbitControls makeDefault target={[0, 1.5, 0]} maxPolarAngle={Math.PI / 2.1} minDistance={3} maxDistance={10} />
    </Canvas>
  );
}