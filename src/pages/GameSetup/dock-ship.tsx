import React, { useState, useEffect, useCallback } from 'react';

// Типы


interface Ship {
  id: string;
  size: number;
  count: number;
}




// Компонент корабля в доке
const DockShip: React.FC<{
  ship: Ship;
  onSelect: (ship: Ship) => void;
}> = ({ ship, onSelect }) => {
  return (
    <div className="dock-ship-container">
      <span className="ship-count">×{ship.count}</span>
      <div 
        className="dock-ship"
        onClick={() => onSelect(ship)}
      >
        {Array(ship.size).fill(null).map((_, i) => (
          <div key={i} className="ship-cell" />
        ))}
      </div>
    </div>
  );
};


export default DockShip;