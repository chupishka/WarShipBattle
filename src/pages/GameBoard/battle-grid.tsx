import * as React from 'react';
import Cell from './cell';
import { useState, useMemo } from 'react';
import { transformField, type RenderField, type Field } from '../../scripts/transform-field';

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

  // Преобразуем поле с бэкенда (5 стейтов) в поле для отрисовки (11 типов + ротация)
  const renderField: RenderField = useMemo(() => {
    return transformField(field, isEnemy);
  }, [field, isEnemy]);

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const rows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const handleCellClick = (row: number, col: number) => {
    if (isEnemy) {
      onCellClick?.(row, col);
    }
  };

  return (
    <div className="battle-grid-container">
      <div className="grid-header">
        <div className="corner-cell" />
        {columns.map((col) => (
          <div key={col} className="coord-label">{col}</div>
        ))}
      </div>

      <div className="grid-body">
        <div className="row-labels">
          {rows.map((row) => (
            <div key={row} className="coord-label">{row}</div>
          ))}
        </div>

        <div className="grid">
          {renderField.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((renderCell, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  renderCell={renderCell}
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
