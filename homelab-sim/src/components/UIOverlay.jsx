import { useEffect, useState } from 'react';
import useBuilderStore from '../store/useBuilderStore';
import InventoryPanel from './InventoryPanel';

function UIOverlay() {
  const { systemStats, errors, installedParts, resetBuild, clearErrors } = useBuilderStore();
  const [showInventory, setShowInventory] = useState(false);
  
  useEffect(() => { if (installedParts.length === 0) setShowInventory(true); }, [installedParts.length]);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between pointer-events-none">
        <div className="glass-panel px-6 py-4 rounded-lg pointer-events-auto">
          <h1 className="text-2xl font-bold">HomeLab Simulator</h1>
        </div>
        <div className="glass-panel px-6 py-4 rounded-lg pointer-events-auto flex gap-8">
           <div><div className="text-xs text-gray-400">COST</div><div className="text-2xl font-bold text-green-400">${systemStats.totalCost}</div></div>
           <div><div className="text-xs text-gray-400">POWER</div><div className="text-2xl font-bold text-blue-400">{systemStats.totalWattage}W</div></div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
        <div className="glass-panel px-8 py-6 rounded-lg max-w-4xl mx-auto pointer-events-auto space-y-4">
            <h2 className="text-sm font-bold text-gray-300">PERFORMANCE PROFILE</h2>
            <div>
                <div className="flex justify-between text-sm text-gray-300"><span>Workstation</span><span>{systemStats.workstationScore}</span></div>
                <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden"><div className="perf-bar-workstation h-full transition-all duration-500" style={{width: `${Math.min(systemStats.workstationScore, 100)}%`}}></div></div>
            </div>
            <div>
                <div className="flex justify-between text-sm text-gray-300"><span>Gaming</span><span>{systemStats.gamingScore}</span></div>
                <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden"><div className="perf-bar-gaming h-full transition-all duration-500" style={{width: `${Math.min(systemStats.gamingScore, 100)}%`}}></div></div>
            </div>
        </div>
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
        <button onClick={() => setShowInventory(!showInventory)} className="glass-panel p-3 rounded-lg hover:bg-white/10">📦 Inventory</button>
        <button onClick={resetBuild} className="glass-panel p-3 rounded-lg text-red-400 hover:bg-red-500/20">↺ Reset</button>
      </div>

      {errors.length > 0 && (
        <div className="absolute top-24 right-6 w-96 space-y-2 pointer-events-auto">
          {errors.map((err) => (
            <div key={err.id} className={`glass-panel p-3 rounded-lg border-l-4 ${err.severity === 'critical' ? 'border-red-500' : 'border-yellow-500'}`}>
               <div className="flex justify-between"><span>{err.message}</span><button onClick={clearErrors}>✕</button></div>
            </div>
          ))}
        </div>
      )}
      {showInventory && <InventoryPanel onClose={() => setShowInventory(false)} />}
    </>
  );
}
export default UIOverlay;
