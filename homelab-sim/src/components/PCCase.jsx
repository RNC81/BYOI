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
      nodes.push({ id: 'motherboard_slot', type: 'MOTHERBOARD_MOUNT', position: [0, -0.5, 0], label: 'Motherboard', scale: 1.2 });
    }
    if (motherboard) {
      if (!installedParts.find(p => p.type === 'cpu')) nodes.push({ id: 'cpu_socket', type: 'CPU_SOCKET', position: [0, 0.3, 0], label: 'CPU', scale: 0.6, socketType: motherboard.specs.socket });
      if (!installedParts.find(p => p.type === 'gpu')) nodes.push({ id: 'pcie_slot_1', type: 'PCIE_X16', position: [0.5, -0.3, 0.1], label: 'GPU', scale: 0.8 });
      const ramCount = installedParts.filter(p => p.type === 'ram').length;
      if (ramCount < 2) nodes.push({ id: ramCount === 0 ? 'ram_slot_1' : 'ram_slot_2', type: 'RAM_SLOT', position: [-0.5, ramCount === 0 ? 0.3 : 0.1, 0.05], label: 'RAM', scale: 0.4 });
    }
    if (!installedParts.find(p => p.type === 'psu')) nodes.push({ id: 'psu_slot', type: 'PSU_MOUNT', position: [0, -2, -0.5], label: 'PSU', scale: 0.8 });
    return nodes;
  };
  
  return (
    <group>
      <RoundedBox ref={caseRef} args={[4, 5, 2]} radius={0.1} smoothness={4}>
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} clearcoat={0.5} />
      </RoundedBox>
      <mesh position={[-2.1, 0, 0]}>
        <boxGeometry args={[0.1, 4.8, 1.8]} />
        <meshPhysicalMaterial color="#ffffff" metalness={0.1} roughness={0.05} transmission={0.95} transparent opacity={0.3} />
      </mesh>
      {getAvailableNodes().map((node) => <PartNode key={node.id} node={node} />)}
      {installedParts.map((part) => <InstalledPart key={part.id} part={part} />)}
    </group>
  );
}
export default PCCase;
