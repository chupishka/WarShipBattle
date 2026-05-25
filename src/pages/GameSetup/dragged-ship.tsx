import React from 'react';
import { IMAGE_MAP } from '../../scripts/setup-render-utils';

type Orientation = 'horizontal' | 'vertical';

interface Ship {
  id: string;
  size: number;
  count: number;
}

const DraggedShip: React.FC<{
  ship: Ship;
  orientation: Orientation;
  position: { x: number; y: number };
}> = ({ ship, orientation, position }) => {
  return (
    <div
      className="dragged-ship"
      style={{
        left: position.x,
        top: position.y,
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        gap: 0, // безшовная стыковка
      }}>
      {Array.from({ length: ship.size }).map((_, i) => {
        let type: 'single' | 'head' | 'center';
        let rotation: number;
        
        if (ship.size === 1) {
          type = 'single';
          rotation = 0;
        } else if (i === 0) {
          type = 'head';
          rotation = orientation === 'horizontal' ? 270 : 0;
        } else if (i === ship.size - 1) {
          type = 'head';
          rotation = orientation === 'horizontal' ? 90 : 180;
        } else {
          type = 'center';
          rotation = orientation === 'horizontal' ? 90 : 0;
        }
        
        return (
          <img
            key={i}
            src={IMAGE_MAP[type]}
            alt={type}
            style={{
              width: 40,
              height: 40,
              transform: `rotate(${rotation}deg)`,
              objectFit: 'cover',
              display: 'block',
            }}
            draggable={false}
          />
        );
      })}
    </div>
  );
};

export default DraggedShip;