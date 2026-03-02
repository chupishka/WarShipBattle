import React from 'react';
import { AutoPlace } from '../../scripts/auto-place';


// Тип для расстановки кораблей (из твоего GameSetup)
type CellState = 0 | 1 | 2 | 3 | 4;
type Field = CellState[][];

// Тип стратегии
type StrategyType = 'strategy1' | 'strategy2';

// Пропсы модалки
interface AutoStrategyModalProps {
  onClose: () => void;
  onSelect: (field: Field) => void;
}

// Функции стратегий (в реальности импортируй из отдельного файла)
const strategy1 = (): Field => {
  // Стратегия 1: корабли по углам и краям
  const field: Field = AutoPlace();
  
  
  
  return field;
};

const strategy2 = (): Field => {
  // Стратегия 2: корабли по центру и диагонали
  const field: Field = Array(10).fill(null).map(() => Array(10).fill(0));
  
  // 4-палубный горизонтально по центру
  field[4][3] = 4; field[4][4] = 4; field[4][5] = 4; field[4][6] = 4;
  
  // 3-палубные
  field[2][1] = 3; field[3][1] = 3; field[4][1] = 3;
  field[6][7] = 3; field[7][7] = 3; field[8][7] = 3;
  
  // 2-палубные
  field[1][5] = 2; field[1][6] = 2;
  field[6][2] = 2; field[7][2] = 2;
  field[8][4] = 2; field[8][5] = 2;
  
  // 1-палубные
  field[0][0] = 1;
  field[9][0] = 1;
  field[0][9] = 1;
  field[9][9] = 1;
  
  return field;
};

const AutoStrategyModal: React.FC<AutoStrategyModalProps> = ({ onClose, onSelect }) => {
  const handleStrategy1 = () => {
    const field = strategy1();
    onSelect(field);
    onClose();
  };

  const handleStrategy2 = () => {
    const field = strategy2();
    onSelect(field);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Выберите стратегию расстановки</h3>
        <p>Автоматическая расстановка кораблей</p>
        
        <div className="strategies-container">
          <button className="strategy-btn" onClick={handleStrategy1}>
            <span className="strategy-number">1</span>
            <span className="strategy-name">Угловая защита</span>
            <span className="strategy-desc">Корабли по периметру поля</span>
          </button>
          
          <button className="strategy-btn" onClick={handleStrategy2}>
            <span className="strategy-number">2</span>
            <span className="strategy-name">Центральный удар</span>
            <span className="strategy-desc">Корабли в центре и на диагонали</span>
          </button>
        </div>

        <button className="cancel-btn" onClick={onClose}>
          Отмена
        </button>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal-content {
          background: #1a1f2e;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          min-width: 350px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .modal-content h3 {
          margin: 0 0 10px 0;
          color: #4ade80;
          font-size: 20px;
        }

        .modal-content > p {
          margin: 0 0 25px 0;
          color: #8b9dc3;
          font-size: 14px;
        }

        .strategies-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }

        .strategy-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          background: #0f1419;
          border: 2px solid #3a4150;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: white;
        }

        .strategy-btn:hover {
          border-color: #4ade80;
          background: #162035;
          transform: translateY(-2px);
        }

        .strategy-number {
          width: 40px;
          height: 40px;
          background: #4ade80;
          color: #0f1419;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .strategy-name {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .strategy-desc {
          font-size: 12px;
          color: #8b9dc3;
        }

        .cancel-btn {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid #3a4150;
          color: #8b9dc3;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          border-color: #ef4444;
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};

export default AutoStrategyModal;