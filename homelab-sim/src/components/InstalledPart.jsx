import { useRef, useState } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import useBuilderStore from '../store/useBuilderStore';

function InstalledPart({ part }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const removePart = useBuilderStore((state) => state.removePart);
  
  // NOUVELLES COORDONNÉES pour coller au boîtier "Real Case"
  const getPosition = () => {
    switch (part.type) {
      case 'motherboard': return [0, 0.5, -0.9]; // Collée au fond
      case 'cpu': return [0, 1.3, -0.85]; // Sur la mobo
      case 'gpu': return [0, 0.2, -0.5]; // Perpendiculaire (classique)
      case 'ram': 
        // Slot 1 ou 2
        return [-0.4, part.nodeId === 'ram_slot_1' ? 1.3 : 1.1, -0.85];
      case 'psu': return [0, -1.8, -0.5]; // Dans le shroud du bas
      default: return [0, 0, 0];
    }
  };
  
  const renderGeometry = () => {
    const pos = getPosition();
    const mat = part.material || { color: '#333', metalness: 0.5, roughness: 0.3 };
    
    // Géométries un peu plus détaillées
    if(part.type === 'motherboard') {
        return (
            <group position={pos}>
                {/* PCB */}
                <RoundedBox args={[2.8, 3.5, 0.1]} radius={0.05}>
                    <meshStandardMaterial {...mat} roughness={0.8} />
                </RoundedBox>
                {/* Radiateurs VRM (Détail visuel) */}
                <mesh position={[-0.5, 1.2, 0.1]}>
                    <boxGeometry args={[0.5, 0.8, 0.3]} />
                    <meshStandardMaterial color="#222" metalness={0.8} />
                </mesh>
            </group>
        );
    }
    
    if(part.type === 'cpu') return <group position={pos}><RoundedBox args={[0.5, 0.5, 0.1]} radius={0.02}><meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0.2} /></RoundedBox></group>;
    
    if(part.type === 'gpu') {
        return (
            <group position={pos}>
                {/* Carte */}
                <RoundedBox args={[2.8, 0.8, 0.3]} radius={0.05}>
                    <meshStandardMaterial {...mat} />
                </RoundedBox>
                {/* Ventilateurs (Texture simulée) */}
                <mesh position={[0.5, 0, 0.16]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                 <mesh position={[-0.5, 0, 0.16]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
            </group>
        );
    }
    
    if(part.type === 'ram') return <group position={pos} rotation={[0, 0, Math.PI/2]}><RoundedBox args={[0.8, 0.1, 0.1]} radius={0.01}><meshStandardMaterial {...mat} emissive={mat.color} emissiveIntensity={0.5} /></RoundedBox></group>;
    
    if(part.type === 'psu') return <group position={pos}><RoundedBox args={[1.8, 0.9, 1.4]} radius={0.05}><meshStandardMaterial color="#222" /></RoundedBox></group>;
    
    return null;
  };
  
  return (
    <group ref={meshRef} onClick={(e) => { e.stopPropagation(); removePart(part.id); }} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }} onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}>
      {renderGeometry()}
      {hovered && <Text position={[getPosition()[0], getPosition()[1] + 0.5, getPosition()[2] + 1]} fontSize={0.3} color="white" renderOrder={1000} depthTest={false}>{part.name}</Text>}
    </group>
  );
}
export default InstalledPart;