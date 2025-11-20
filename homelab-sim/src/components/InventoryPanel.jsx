import { useState } from 'react';
import { getCategories, getPartsByCategory } from '../data/parts_db';
import useBuilderStore from '../store/useBuilderStore';

function InventoryPanel({ onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('Motherboard');
  const addPart = useBuilderStore((state) => state.addPart);
  const selectedNode = useBuilderStore((state) => state.selectedNode);
  const installedParts = useBuilderStore((state) => state.installedParts);
  
  const categories = getCategories();
  const availableParts = getPartsByCategory(selectedCategory);
  
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
          <h2 className="text-2xl font-bold">Inventory</h2>
          <button onClick={onClose} className="text-white">✕</button>
        </div>
        <div className="flex gap-2 p-4 border-b border-white/10 overflow-x-auto">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-lg ${selectedCategory === cat ? 'bg-blue-500/30 text-blue-300' : 'bg-white/5'}`}>{cat}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
          {availableParts.map((part) => {
            const installed = installedParts.some(p => p.id === part.id);
            return (
              <div key={part.id} onClick={() => !installed && handleAddPart(part)} className={`glass-panel p-4 ${installed ? 'opacity-50' : 'cursor-pointer hover:bg-white/10'}`}>
                <div className="flex justify-between">
                   <h3 className="font-bold">{part.name}</h3>
                   <span className="text-green-400">${part.price_estimate}</span>
                </div>
                <p className="text-sm text-gray-400">{part.description}</p>
                {!installed && <button className="mt-2 w-full bg-blue-500 py-1 rounded">Add</button>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default InventoryPanel;
