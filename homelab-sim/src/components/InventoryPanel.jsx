import { useState, useMemo } from 'react';
import useBuilderStore from '../store/useBuilderStore';
import { X, Cpu, Database, Zap, Box, CircuitBoard } from 'lucide-react'; // Assure-toi d'avoir lucide-react installé, sinon retire les icônes

function InventoryPanel({ onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('Motherboard');
  
  const availableParts = useBuilderStore((state) => state.availableParts);
  const installedParts = useBuilderStore((state) => state.installedParts);
  const addPart = useBuilderStore((state) => state.addPart);
  const selectedNode = useBuilderStore((state) => state.selectedNode);
  
  const categories = useMemo(() => {
    return [...new Set(availableParts.map(part => part.category))];
  }, [availableParts]);

  const filteredParts = availableParts.filter(part => part.category === selectedCategory);
  
  const handleAddPart = (part) => {
    let targetNode = selectedNode;
    if (!targetNode) {
      const map = { 'motherboard': 'motherboard_slot', 'cpu': 'cpu_socket', 'gpu': 'pcie_slot_1', 'ram': 'ram_slot_1', 'psu': 'psu_slot' };
      const typeMap = { 'motherboard': 'MOTHERBOARD_MOUNT', 'cpu': 'CPU_SOCKET', 'gpu': 'PCIE_X16', 'ram': 'RAM_SLOT', 'psu': 'PSU_MOUNT' };
      targetNode = { id: map[part.type], type: typeMap[part.type] };
    }
    addPart(part, targetNode);
    // Note: On ne ferme plus le panneau automatiquement pour permettre d'enchainer
  };
  
  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-black/80 backdrop-blur-xl border-l border-white/10 flex flex-col shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
        <div>
          <h2 className="text-xl font-bold text-white">Component Select</h2>
          <p className="text-xs text-gray-400 mt-1">
            {selectedNode ? `Slot: ${selectedNode.label}` : 'Select a part to install'}
          </p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <span className="text-2xl">×</span>
        </button>
      </div>
      
      {/* Categories (Scrollable horizontal) */}
      <div className="flex gap-2 p-4 border-b border-white/10 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)} 
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* Parts List (Scrollable vertical) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filteredParts.length === 0 ? (
           <div className="text-gray-500 text-center mt-10 italic">No parts found via API...</div>
        ) : (
          filteredParts.map((part) => {
            const installed = installedParts.some(p => p.id === part.id);
            const specs = part.specs; 
            
            return (
              <div 
                key={part.id} 
                onClick={() => !installed && handleAddPart(part)} 
                className={`group relative p-4 rounded-xl border transition-all duration-200 ${
                  installed 
                    ? 'bg-white/5 border-transparent opacity-50 cursor-not-allowed' 
                    : 'bg-gradient-to-br from-white/5 to-transparent border-white/5 hover:border-blue-500/50 hover:shadow-lg cursor-pointer'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-white text-sm pr-2 leading-tight">{part.name}</h3>
                   <span className="text-green-400 font-mono text-sm font-bold">${part.price_estimate}</span>
                </div>
                
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">{part.description}</p>
                
                {/* Mini specs display */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 font-mono">
                   {specs.socket && <div className="bg-black/20 px-1.5 py-0.5 rounded">SOCK: {specs.socket}</div>}
                   {specs.wattage && <div className="bg-black/20 px-1.5 py-0.5 rounded">PWR: {specs.wattage}W</div>}
                   {specs.vram && <div className="bg-black/20 px-1.5 py-0.5 rounded">VRAM: {specs.vram}GB</div>}
                </div>

                {!installed && (
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
export default InventoryPanel;