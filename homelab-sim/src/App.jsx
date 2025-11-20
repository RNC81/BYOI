import React from 'react';
import './App.css';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';

function App() {
  return (
    <div className="app-container" data-testid="app-container">
      <Scene />
      <UIOverlay />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <div className="text-xs text-gray-500">
          <p>Click holographic nodes to add components | Hover installed parts to remove</p>
          <p className="mt-1">Drag to orbit • Scroll to zoom • Right-click to pan</p>
        </div>
      </div>
    </div>
  );
}
export default App;
