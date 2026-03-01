import React, { useState } from 'react';

// Константы состояний
const CELL_STATE = {
  EMPTY: 0,
  MISS: 1,
  UNDAMAGED: 2,
  DAMAGED: 3,
  DESTROYED: 4,
};
type CellState = 0 | 1 | 2 | 3 | 4;

interface CellProps {
  state: CellState;
  onClick: () => void;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// Компонент одной клетки
const Cell: React.FC<CellProps> = ({ state, onClick, isHovered, onMouseEnter, onMouseLeave }) => {
  const getCellContent = () => {
    switch (state) {
      case CELL_STATE.EMPTY:
        return <div className="cell-water" />;
      case CELL_STATE.MISS:
        return <div className="cell-miss" />;
      case CELL_STATE.UNDAMAGED:
        return <div className="cell-ship" />;
      case CELL_STATE.DAMAGED:
        return <div className="cell-damaged" />;
      case CELL_STATE.DESTROYED:
        return <div className="cell-destroyed" />;
      default:
        return null;
    }
  };
  return (
    <div
      className={`cell ${isHovered ? 'cell-hovered' : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      {getCellContent()}
    </div>
  );
};

export default Cell;
