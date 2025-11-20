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
      nodes.push({ id: 'motherboard_slot', type: 'MOTHERBOARD_MOUNT', position: [0, -0.5, -0.5], label: 'Install Motherboard', scale: 1.2 });
    }
    if (motherboard) {
      if (!installedParts.find(p => p.type === 'cpu')) nodes.push({ id: 'cpu_socket', type: 'CPU_SOCKET', position: [0, 0.3, -0.5], label: 'CPU Socket', scale: 0.6, socketType: motherboard.specs.socket });
      if (!installedParts.find(p => p.type === 'gpu')) nodes.push({ id: 'pcie_slot_1', type: 'PCIE_X16', position: [0.5, -0.3, -0.4], label: 'PCIe x16', scale: 0.8 });
      const ramCount = installedParts.filter(p => p.type === 'ram').length;
      if (ramCount < 2) nodes.push({ id: ramCount === 0 ? 'ram_slot_1' : 'ram_slot_2', type: 'RAM_SLOT', position: [-0.5, ramCount === 0 ? 0.3 : 0.1, -0.45], label: 'DIMM Slot', scale: 0.4 });
    }
    if (!installedParts.find(p => p.type === 'psu')) nodes.push({ id: 'psu_slot', type: 'PSU_MOUNT', position: [0, -2, -0.5], label: 'PSU Bay', scale: 0.8 });
    return nodes;
  };
  
  return (
    <group>
      {/* --- CHASSIS PRINCIPAL (Cadre Métal Noir) --- */}
      {/* Fond du boîtier */}
      <RoundedBox args={[4, 5, 0.1]} position={[0, 0, -1.5]} radius={0.1}>
         <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {/* Toit */}
      <RoundedBox args={[4, 0.1, 2]} position={[0, 2.5, -0.5]} radius={0.05}>
         <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {/* Sol */}
      <RoundedBox args={[4, 0.1, 2]} position={[0, -2.5, -0.5]} radius={0.05}>
         <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {/* Face Avant (Mesh) */}
      <RoundedBox args={[4, 5, 0.1]} position={[0, 0, 0.5]} radius={0.1}>
         <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.8} />
      </RoundedBox>

      {/* --- VITRE LATÉRALE (Verre Trempé) --- */}
      <group position={[0, 0, 0.6]}>
        {/* On décale légèrement pour simuler l'épaisseur */}
        <mesh position={[2.05, 0, -1.1]} rotation={[0, Math.PI / 2, 0]}>
           <boxGeometry args={[2.2, 4.8, 0.05]} />
           <meshPhysicalMaterial 
              color="#skyblue" 
              transmission={1}  // Laisse passer la lumière (Verre)
              opacity={0.3} 
              metalness={0} 
              roughness={0} 
              thickness={0.1} 
              transparent={true}
              ior={1.5} // Indice de réfraction du verre
           />
        </mesh>
      </group>
      
      {/* --- LUMIÈRE INTERNE (RGB Strip simulation) --- */}
      <pointLight position={[1, 2, -0.5]} intensity={2} color="#00f3ff" distance={5} decay={2} />
      <pointLight position={[-1, -1, -0.5]} intensity={1} color="#ff0055" distance={5} decay={2} />

      {/* --- COMPOSANTS --- */}
      <group position={[0, 0, 0]}> {/* Ajustement de la position des composants pour être "dans" le boîtier */}
        {getAvailableNodes().map((node) => <PartNode key={node.id} node={node} />)}
        {installedParts.map((part) => <InstalledPart key={part.id} part={part} />)}
      </group>
    </group>
  );
}
export default PCCase;