import React, { useEffect, useState } from 'react';
import './App.css';
import Scene from './components/Scene';
import LabScene from './components/LabScene'; // <--- Import
import UIOverlay from './components/UIOverlay';
import useBuilderStore from './store/useBuilderStore';

function App() {
  const fetchParts = useBuilderStore((state) => state.fetchParts);
  const [viewMode, setViewMode] = useState('builder'); // 'builder' ou 'lab'

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  return (
    <div className="app-container">
      
      {/* Navigation Rapide */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-black/50 p-2 rounded-full backdrop-blur-md border border-white/10">
        <button 
          onClick={() => setViewMode('builder')}
          className={`px-4 py-1 rounded-full text-sm font-bold transition-all ${viewMode === 'builder' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          PC BUILDER
        </button>
        <button 
          onClick={() => setViewMode('lab')}
          className={`px-4 py-1 rounded-full text-sm font-bold transition-all ${viewMode === 'lab' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          NETWORK LAB
        </button>
      </div>

      {/* Vue Conditionnelle */}
      {viewMode === 'builder' ? (
        <>
          <Scene />
          <UIOverlay />
        </>
      ) : (
        <LabScene />
      )}

    </div>
  );
}

export default App;