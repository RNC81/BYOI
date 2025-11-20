import { useEffect, useState } from 'react';
import useBuilderStore from '../store/useBuilderStore';
import InventoryPanel from './InventoryPanel';

function UIOverlay() {
  const { systemStats, errors, installedParts, resetBuild, clearErrors, saveBuild, saveStatus } = useBuilderStore();
  const [showInventory, setShowInventory] = useState(false);
  
  useEffect(() => { if (installedParts.length === 0) setShowInventory(true); }, [installedParts.length]);

  const handleSave = () => {
    // Pour l'instant on hardcode le nom, on fera une popup plus tard
    const buildName = `Build ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    saveBuild(buildName);
  };

  return (
    <>
      {/* --- TOP BAR --- */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none z-40">
        {/* Logo Area */}
        <div className="glass-panel px-6 py-4 rounded-lg pointer-events-auto">
          <h1 className="text-2xl font-bold text-white mb-0 tracking-tighter">HomeLab<span className="text-blue-500">Sim</span></h1>
          <div className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Architecture Planner</div>
        </div>
        
        {/* Stats Area */}
        <div className="flex gap-4 pointer-events-auto">
           <div className="glass-panel px-5 py-3 rounded-lg flex flex-col items-end">
              <div className="text-[10px] text-gray-400 font-bold tracking-wider">EST. COST</div>
              <div className="text-xl font-bold text-green-400 font-mono">${systemStats.totalCost}</div>
           </div>
           <div className="glass-panel px-5 py-3 rounded-lg flex flex-col items-end">
              <div className="text-[10px] text-gray-400 font-bold tracking-wider">POWER DRAW</div>
              <div className={`text-xl font-bold font-mono ${systemStats.powerEfficiency === 0 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                {systemStats.totalWattage}W
              </div>
           </div>
           
           {/* SAVE BUTTON */}
           <button 
             onClick={handleSave}
             disabled={saveStatus === 'saving'}
             className={`glass-panel px-5 py-3 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all ${saveStatus === 'success' ? 'border-green-500 bg-green-500/10' : ''}`}
           >
              <div className="text-[10px] text-gray-400 font-bold tracking-wider">ACTION</div>
              <div className="text-sm font-bold text-white">
                {saveStatus === 'saving' ? 'SAVING...' : saveStatus === 'success' ? 'SAVED!' : 'SAVE BUILD'}
              </div>
           </button>
        </div>
      </div>

      {/* --- BOTTOM PERFORMANCE BAR --- */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none z-40">
        <div className="glass-panel px-8 py-6 rounded-xl max-w-3xl mx-auto pointer-events-auto backdrop-blur-xl border-t border-white/10">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xs font-bold text-gray-400 tracking-[0.2em]">REAL-TIME ANALYTICS</h2>
              <span className="text-xs text-gray-600">{installedParts.length} Modules Active</span>
            </div>
            
            <div className="space-y-4">
              {/* Workstation Bar */}
              <div className="relative">
                  <div className="flex justify-between text-xs text-gray-300 mb-1 font-mono"><span>WORKSTATION CAPABILITY</span><span>{systemStats.workstationScore} PTS</span></div>
                  <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{width: `${Math.min(systemStats.workstationScore, 100)}%`}}></div>
                  </div>
              </div>
              
              {/* Gaming Bar */}
              <div className="relative">
                  <div className="flex justify-between text-xs text-gray-300 mb-1 font-mono"><span>GAMING / RENDERING</span><span>{systemStats.gamingScore} PTS</span></div>
                  <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{width: `${Math.min(systemStats.gamingScore, 100)}%`}}></div>
                  </div>
              </div>
            </div>
        </div>
      </div>

      {/* --- RIGHT CONTROLS --- */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto z-40">
        <button onClick={() => setShowInventory(!showInventory)} className="glass-panel p-4 rounded-xl hover:bg-white/10 hover:scale-105 transition-all group">
           <span className="text-2xl group-hover:rotate-12 transition-transform block">📦</span>
        </button>
        <button onClick={resetBuild} className="glass-panel p-4 rounded-xl text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all">
           <span className="text-2xl">↺</span>
        </button>
      </div>

      {/* --- NOTIFICATIONS --- */}
      <div className="absolute top-28 right-6 w-80 space-y-2 pointer-events-none z-50">
        {errors.map((err) => (
          <div key={err.id} className={`glass-panel p-4 rounded-lg border-l-4 shadow-xl pointer-events-auto animate-slide-in ${err.severity === 'critical' ? 'border-red-500 bg-red-900/20' : 'border-yellow-500 bg-yellow-900/20'}`}>
             <div className="flex justify-between items-start">
               <span className="text-sm font-medium text-white">{err.message}</span>
               <button onClick={clearErrors} className="text-white/50 hover:text-white ml-2">×</button>
             </div>
          </div>
        ))}
      </div>

      {/* --- INVENTORY DRAWER --- */}
      {showInventory && <InventoryPanel onClose={() => setShowInventory(false)} />}
    </>
  );
}
export default UIOverlay;