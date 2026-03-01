import React, { useState, useEffect, useCallback } from 'react';

// Типы

type Orientation = 'horizontal' | 'vertical';

interface Ship {
  id: string;
  size: number;
  count: number;
}

// Константы кораблей

// Компонент перетаскиваемого корабля (следует за курсором)
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
      }}>
      {Array(ship.size)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="ship-cell" />
        ))}
    </div>
  );
};

export default DraggedShip;
