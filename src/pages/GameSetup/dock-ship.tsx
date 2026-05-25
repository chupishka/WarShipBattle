import React from 'react';
import { IMAGE_MAP } from '../../scripts/setup-render-utils';

interface Ship {
  id: string;
  size: number;
  count: number;
}

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
        {Array.from({ length: ship.size }).map((_, i) => {
          let type: 'single' | 'head' | 'center';
          let rotation: number;
          
          if (ship.size === 1) {
            type = 'single';
            rotation = 0;
          } else if (i === 0) {
            type = 'head';
            rotation = 270; // нос смотрит влево (корабль в доке слева направо)
          } else if (i === ship.size - 1) {
            type = 'head';
            rotation = 90; // хвост смотрит вправо
          } else {
            type = 'center';
            rotation = 90; // горизонтально
          }
          
          return (
            <img
              key={i}
              src={IMAGE_MAP[type]}
              alt={type}
              className="dock-ship-cell"
              style={{
                width: 36,
                height: 36,
                transform: `rotate(${rotation}deg)`,
                objectFit: 'cover',
                display: 'block',
              }}
              draggable={false}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DockShip;