import React from 'react';
import type { RenderCell, RenderCellType } from '../../scripts/transform-field';

interface CellProps {
  renderCell: RenderCell;
  onClick: () => void;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}
export const CELL_STATE = {
  EMPTY: 0,
  MISS: 1,
  UNDAMAGED: 2,
  DAMAGED: 3,
  DESTROYED: 4,
} as const;
type CellState = 0 | 1 | 2 | 3 | 4;
// Маппинг типов к путям картинок — ЗАМЕНИ на свои пути к PNG
const IMAGE_MAP: Record<RenderCellType, string> = {
  'water': '/img/ships/water.png',
  'miss': '/img/ships/splash.png',
  'single-alive': '/img/ships/1_ship.png',
  'single-damaged': '/img/ships/1_ship_damaged.png',
  'single-destroyed': '/img/ships/1_ship_destroyed.png',
  'head-alive': '/img/ships/ship_bow.png',
  'head-damaged': '/img/ships/ship_bow_damaged.png',
  'head-destroyed': '/img/ships/ship_bow_destroyed.png',
  'center-alive': '/img/ships/ship_mid.png',
  'center-damaged': '/img/ships/ship_mid_damaged.png',
  'center-destroyed': '/img/ships/ship_mid_destroyed.png',
};

const Cell: React.FC<CellProps> = ({ renderCell, onClick, isHovered, onMouseEnter, onMouseLeave }) => {
  const imagePath = IMAGE_MAP[renderCell.type];

  return (
    <div
      className={`cell ${isHovered ? 'cell-hovered' : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img 
        src={imagePath}
        alt={renderCell.type}
        className="cell-image"
        style={{ 
          transform: `rotate(${renderCell.rotation}deg)`,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none'
        }}
        draggable={false}
      />
    </div>
  );
};

export default Cell;

