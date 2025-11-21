import { useRef } from 'react';
import { RoundedBox, useTexture } from '@react-three/drei';
import useBuilderStore from '../store/useBuilderStore';
import PartNode from './PartNode';
import InstalledPart from './InstalledPart';

function PCCase() {
  const installedParts = useBuilderStore((state) => state.installedParts);
  const motherboard = installedParts.find(p => p.type === 'motherboard');
  
  // Ajustement des positions des nodes pour coller au nouveau design
  const getAvailableNodes = () => {
    const nodes = [];
    // Motherboard collée au fond du boîtier
    if (!motherboard) {
      nodes.push({ id: 'motherboard_slot', type: 'MOTHERBOARD_MOUNT', position: [0, 0.5, -0.4], label: 'Install Motherboard', scale: 1.2 });
    }
    if (motherboard) {
      // Composants relatifs à la carte mère
      if (!installedParts.find(p => p.type === 'cpu')) nodes.push({ id: 'cpu_socket', type: 'CPU_SOCKET', position: [0, 1.3, -0.35], label: 'CPU', scale: 0.6, socketType: motherboard.specs.socket });
      if (!installedParts.find(p => p.type === 'gpu')) nodes.push({ id: 'pcie_slot_1', type: 'PCIE_X16', position: [0, 0.2, -0.1], label: 'PCIe x16', scale: 0.8 });
      
      const ramCount = installedParts.filter(p => p.type === 'ram').length;
      if (ramCount < 2) {
        // Slots RAM décalés
        nodes.push({ id: ramCount === 0 ? 'ram_slot_1' : 'ram_slot_2', type: 'RAM_SLOT', position: [-0.4, ramCount === 0 ? 1.3 : 1.1, -0.3], label: 'DIMM', scale: 0.4 });
      }
    }
    // PSU caché sous le shroud en bas
    if (!installedParts.find(p => p.type === 'psu')) nodes.push({ id: 'psu_slot', type: 'PSU_MOUNT', position: [0, -1.8, -0.5], label: 'PSU Bay', scale: 0.8 });
    return nodes;
  };
  
  return (
    <group position={[0, -1, 0]}> {/* On descend un peu le tout pour centrer */}
      
      {/* === 1. STRUCTURE MÉTALLIQUE (CHÂSSIS) === */}
      
      {/* Panneau Arrière (Backplate) */}
      <mesh position={[0, 0.5, -1]} receiveShadow castShadow>
        <boxGeometry args={[4, 5, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Toit */}
      <mesh position={[0, 3, 0]} receiveShadow castShadow>
        <boxGeometry args={[4, 0.1, 2]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Sol (Pieds) */}
      <mesh position={[0, -2.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[4, 0.1, 2]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* PSU SHROUD (Cache Alimentation en bas) - Style NZXT */}
      <mesh position={[0, -1.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[4, 1.2, 2]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Logo sur le shroud */}
      <mesh position={[1.5, -1.5, 1.01]}>
         <planeGeometry args={[0.8, 0.2]} />
         <meshBasicMaterial color="#333" />
      </mesh>

      {/* Façade Avant (Pleine ou Mesh) */}
      <mesh position={[2, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[2, 5, 0.1]} />
        <meshStandardMaterial color="#111" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* === 2. LA VITRE LATÉRALE (LE VRAI VERRE) === */}
      <mesh position={[0, 0.5, 1]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3.8, 4.8, 0.05]} />
        <meshPhysicalMaterial 
          color="white"
          transmission={0.95}  // Transparence physique
          opacity={1}
          metalness={0}
          roughness={0}
          ior={1.5}            // Indice de réfraction (Verre)
          thickness={0.5}      // Épaisseur pour la réfraction
          specularIntensity={1}
          envMapIntensity={1}
          transparent={true}
        />
      </mesh>
      
      {/* Cadre de la vitre (Bordures noires) */}
      <mesh position={[0, 0.5, 1]}>
         <boxGeometry args={[3.9, 4.9, 0.04]} />
         <meshStandardMaterial color="black" wireframe />
      </mesh>

      {/* === 3. ÉCLAIRAGE INTERNE (RGB GAMING) === */}
      {/* Bande LED */}
      <mesh position={[0, 2.9, 0]}>
        <boxGeometry args={[3.5, 0.05, 0.05]} />
        <meshBasicMaterial color="#00f3ff" toneMapped={false} />
      </mesh>
      <pointLight position={[0, 2, 0]} intensity={3} color="#00f3ff" distance={4} decay={2} />

      {/* Bande LED Arrière */}
      <mesh position={[-1.8, 0.5, -0.9]} rotation={[0, 0, Math.PI/2]}>
        <boxGeometry args={[4, 0.05, 0.05]} />
        <meshBasicMaterial color="#ff0055" toneMapped={false} />
      </mesh>
      <pointLight position={[-1, 0, -0.5]} intensity={2} color="#ff0055" distance={3} decay={2} />

      {/* === 4. LES COMPOSANTS DANS LE BOÎTIER === */}
      {/* On les décale légèrement pour qu'ils soient "dans" le boîtier et pas à travers */}
      <group position={[0, 0, 0]}>
        {getAvailableNodes().map((node) => <PartNode key={node.id} node={node} />)}
        {installedParts.map((part) => <InstalledPart key={part.id} part={part} />)}
      </group>
    </group>
  );
}
export default PCCase;