import React, { useState } from 'react';
import BattleGrid from './battle-grid';
import PlayerInfo from './player-info';

// Тестовые данные - мое поле (вижу свои корабли и куда стрелял враг)
const testMyField:Field = [
  [2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
  [0, 2, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 0, 3, 3, 0, 0],
  [0, 2, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 4, 4, 0],
  [0, 0, 2, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 2, 0]
];

// Тестовые данные - поле врага (вижу только свои выстрелы)
const testEnemyField:Field = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 4, 4, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 2, 0, 0, 0, 0, 0, 0]
];
type CellState = 0 | 1 | 2 | 3 | 4;
type Field = CellState[][];


const GameBoard = () => {
  const [myField, setMyField] = useState<Field>(testMyField);
  const [enemyField, setEnemyField] = useState<Field>(testEnemyField);

  const handleEnemyCellClick = (row: number, col: number): void => {
    console.log(`Выстрел по координатам: ${String.fromCharCode(65 + col)}${row + 1}`);
    // Здесь будет логика отправки выстрола на бэкенд
  };

  return (
    <div className="game-board">
      <div className="fields-container">
        <div className="field-section">
          
          <h3 className="field-title">Ваше поле</h3>
          <BattleGrid field={myField} isEnemy={false} />
          <PlayerInfo nickname="ВашНик" /* avatarUrl={myAvatar} */ />
        </div>
        
        <div className="field-section">
          
          <h3 className="field-title">Поле противника</h3>
          <BattleGrid field={enemyField} isEnemy={true} onCellClick={handleEnemyCellClick} />
          <PlayerInfo nickname="Противник" isEnemy={true} /* avatarUrl={enemyAvatar} */ />
        </div>
      </div>
      
      <style>{`
        .game-board {
          padding: 20px;
          background: #0f1419;
          min-height: 100vh;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          user-select: none;
        }
        
        .fields-container {
          display: flex;
          justify-content: center;
          gap: 60px;
          flex-wrap: wrap;
        }
        
        .field-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        
        .player-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          background: #1a1f2e;
          border-radius: 8px;
          margin-bottom: 5px;
          flex-direction: row;
        }
        
        .player-info-me {
          flex-direction: row;
        }
        
        .player-info-enemy {
          flex-direction: row-reverse; /* Враг: аватар справа, ник слева */
        }
        
        .player-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #4ade80;
          flex-shrink: 0;
        }
        
        .player-info-enemy .player-avatar {
          border-color: #ef4444;
        }
        
        .player-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: #4ade80;
        }
        
        .avatar-placeholder-enemy {
          background: #ef4444;
        }
        
        .player-nickname {
          color: #e0e0e0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .field-title {
          margin-bottom: 15px;
          font-size: 18px;
          color: #e0e0e0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .battle-grid-container {
          background: #1a1f2e;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        
        .grid-header {
          display: flex;
          margin-bottom: 5px;
        }
        
        .corner-cell {
          width: 40px;
          height: 20px;
        }
        
        .coord-label {
          width: 40px;
          text-align: center;
          font-size: 12px;
          color: #8b9dc3;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .grid-body {
          display: flex;
        }
        
        .row-labels {
          display: flex;
          flex-direction: column;
          margin-right: 5px;
        }
        
        .row-labels .coord-label {
          height: 40px;
          
        }
        
        .grid {
          display: flex;
          flex-direction: column;
          border: 1px solid #3a4150;
          user-select: none;
        }
        
        .grid-row {
          display: flex;
        }
        
        .cell {
          width: 40px;
          height: 40px;
          border: 1px solid #3a4150;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s ease;
          userSelect: 'none';
          WebkitUserSelect: 'none';
          MozUserSelect: 'none';
        }
        
        .cell-hovered {
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);
          z-index: 10;
          userSelect: 'none';
          WebkitUserSelect: 'none';
          MozUserSelect: 'none';
        }
        
        /* Placeholder стили для разных состояний */
        .cell-water {
          width: 100%;
          height: 100%;
          
          pointer-events: none;
          position: relative;
        }
        
        .cell-miss {
          width: 12px;
          height: 12px;
          background: #5a6b8c;
          border-radius: 50%;
        }
        
        .cell-ship {
          width: 32px;
          height: 32px;
          background: #4ade80;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .cell-damaged {
          width: 32px;
          height: 32px;
          background: #fb923c;
          border-radius: 4px;
          position: relative;
        }
        
        .cell-damaged::before,
        .cell-damaged::after {
          content: '';
          position: absolute;
          background: #7c2d12;
          width: 2px;
          height: 20px;
          top: 50%;
          left: 50%;
        }
        
        .cell-damaged::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        
        .cell-damaged::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
        
        .cell-destroyed {
          width: 32px;
          height: 32px;
          background: #ef4444;
          border-radius: 4px;
          position: relative;
        }
        
        .cell-destroyed::before,
        .cell-destroyed::after {
          content: '';
          position: absolute;
          background: #450a0a;
          width: 3px;
          height: 28px;
          top: 50%;
          left: 50%;
        }
        
        .cell-destroyed::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        
        .cell-destroyed::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
      `}</style>
    </div>
  );
};

export default GameBoard;