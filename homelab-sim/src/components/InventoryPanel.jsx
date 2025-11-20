import { useState, useMemo } from 'react';
import useBuilderStore from '../store/useBuilderStore';

function InventoryPanel({ onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('Motherboard');
  
  // On récupère les données depuis le Store au lieu du fichier statique
  const availableParts = useBuilderStore((state) => state.availableParts);
  const installedParts = useBuilderStore((state) => state.installedParts);
  const addPart = useBuilderStore((state) => state.addPart);
  const selectedNode = useBuilderStore((state) => state.selectedNode);
  
  // Calcul dynamique des catégories
  const categories = useMemo(() => {
    return [...new Set(availableParts.map(part => part.category))];
  }, [availableParts]);

  // Filtrage dynamique
  const filteredParts = availableParts.filter(part => part.category === selectedCategory);
  
  const handleAddPart = (part) => {
    let targetNode = selectedNode;
    if (!targetNode) {
      const map = { 'motherboard': 'motherboard_slot', 'cpu': 'cpu_socket', 'gpu': 'pcie_slot_1', 'ram': 'ram_slot_1', 'psu': 'psu_slot' };
      const typeMap = { 'motherboard': 'MOTHERBOARD_MOUNT', 'cpu': 'CPU_SOCKET', 'gpu': 'PCIE_X16', 'ram': 'RAM_SLOT', 'psu': 'PSU_MOUNT' };
      targetNode = { id: map[part.type], type: typeMap[part.type] };
    }
    addPart(part, targetNode);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-panel rounded-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Inventory (API Connected)</h2>
          <button onClick={onClose} className="text-white">✕</button>
        </div>
        
        {/* Categories */}
        <div className="flex gap-2 p-4 border-b border-white/10 overflow-x-auto">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-lg ${selectedCategory === cat ? 'bg-blue-500/30 text-blue-300' : 'bg-white/5'}`}>{cat}</button>
          ))}
        </div>
        
        {/* Parts Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
          {filteredParts.length === 0 ? (
             <div className="text-gray-400 text-center col-span-2">Loading parts from database...</div>
          ) : (
            filteredParts.map((part) => {
              const installed = installedParts.some(p => p.id === part.id);
              // Gestion sécurisée des specs (si MongoDB renvoie un objet ou non)
              const specs = part.specs; 
              
              return (
                <div key={part.id} onClick={() => !installed && handleAddPart(part)} className={`glass-panel p-4 ${installed ? 'opacity-50' : 'cursor-pointer hover:bg-white/10'}`}>
                  <div className="flex justify-between">
                     <h3 className="font-bold">{part.name}</h3>
                     <span className="text-green-400">${part.price_estimate}</span>
                  </div>
                  <p className="text-sm text-gray-400">{part.description}</p>
                  
                  {/* Mini specs display */}
                  <div className="mt-2 text-xs text-gray-500 flex gap-2">
                     {specs.socket && <span className="bg-white/5 px-1 rounded">{specs.socket}</span>}
                     {specs.wattage && <span className="bg-white/5 px-1 rounded">{specs.wattage}W</span>}
                  </div>

                  {!installed && <button className="mt-2 w-full bg-blue-500 py-1 rounded">Add</button>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
export default InventoryPanel;