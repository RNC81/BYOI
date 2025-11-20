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
