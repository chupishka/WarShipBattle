import * as React from 'react';
import Cell from './cell';
import { useState } from 'react';


type CellState = 0 | 1 | 2 | 3 | 4;

// Тип для поля (двумерный массив)
type Field = CellState[][];

interface BattleGridProps {
  field: Field;
  isEnemy: boolean;
  onCellClick?: (row: number, col: number) => void;
}
interface HoveredCell {
  row: number;
  col: number;
}
const BattleGrid: React.FC<BattleGridProps> = ({ field, isEnemy, onCellClick }) => {
  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null);

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const rows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const handleCellClick = (row: number, col: number) => {
    if (isEnemy) {
      onCellClick?.(row, col);
    }
  };

  return (
    <div className="battle-grid-container">
      {/* Заголовки колонок (A-J) */}
      <div className="grid-header">
        <div className="corner-cell" />
        {columns.map((col) => (
          <div key={col} className="coord-label">
            {col}
          </div>
        ))}
      </div>

      <div className="grid-body">
        {/* Заголовки строк (1-10) */}
        <div className="row-labels">
          {rows.map((row) => (
            <div key={row} className="coord-label">
              {row}
            </div>
          ))}
        </div>

        {/* Игровое поле */}
        <div className="grid">
          {field.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((cellState, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  state={cellState}
                  isHovered={hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex}
                  onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                  onMouseLeave={() => setHoveredCell(null)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleGrid;
