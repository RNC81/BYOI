import React, { useEffect } from 'react';
import './App.css';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import useBuilderStore from './store/useBuilderStore';

function App() {
  // On récupère l'action fetchParts du store
  const fetchParts = useBuilderStore((state) => state.fetchParts);

  // useEffect avec [] signifie "Lance ça une seule fois au montage du composant"
  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  return (
    <div className="app-container" data-testid="app-container">
      <Scene />
      <UIOverlay />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <div className="text-xs text-gray-500">
          <p>Connected to Backend API | Click holographic nodes to add components</p>
          <p className="mt-1">Drag to orbit • Scroll to zoom • Right-click to pan</p>
        </div>
      </div>
    </div>
  );
}

export default App;