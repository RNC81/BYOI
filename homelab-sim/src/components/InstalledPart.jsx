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
