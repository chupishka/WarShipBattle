import React, { useState, useEffect, useCallback } from 'react';
import DockShip from './dock-ship';
import DraggedShip from './dragged-ship';
import RoomCodeModal from './room-code-modal';
import TestSocket from '../test-socket';
import useGameSocket from './use-game-socket';

// Типы
type CellState = 0 | 1 | 2 | 3 | 4;
type Field = CellState[][];
type GameMode = 'bot' | 'player';
type BotDifficulty = 'easy' | 'medium' | 'hard';
type Orientation = 'horizontal' | 'vertical';

interface Ship {
  id: string;
  size: number;
  count: number;
}

interface PlacedShip {
  id: string;
  size: number;
  row: number;
  col: number;
  orientation: Orientation;
}

interface Position {
  row: number;
  col: number;
}

// Константы кораблей
const INITIAL_SHIPS: Ship[] = [
  { id: 'battleship', size: 4, count: 1 },
  { id: 'cruiser', size: 3, count: 2 },
  { id: 'destroyer', size: 2, count: 3 },
  { id: 'submarine', size: 1, count: 4 },
];

// Создать пустое поле
const createEmptyField = (): Field =>
  Array(10)
    .fill(null)
    .map(() => Array(10).fill(0));

const GameSetup: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>('bot');
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('medium');
  const [field, setField] = useState<Field>(createEmptyField());
  const [shipsInDock, setShipsInDock] = useState<Ship[]>(INITIAL_SHIPS);
  const [placedShips, setPlacedShips] = useState<PlacedShip[]>([]);

  // Состояние перетаскивания
  const [draggedShip, setDraggedShip] = useState<Ship | null>(null);
  const [draggedFromField, setDraggedFromField] = useState<PlacedShip | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredCell, setHoveredCell] = useState<Position | null>(null);
  const [previewOrientation, setPreviewOrientation] = useState<Orientation>('horizontal');

  // Модалка
  const [showModal, setShowModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  // const { lastMessage, sendMessage } = useGameSocket('game');
  // useEffect(() => {
  //   if (lastMessage?.code) {
  //     setRoomCode(lastMessage.code);
      
  //   }
  // }, [lastMessage]);

  // Отслеживание мыши
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Поворот корабля ПКМ
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (draggedShip) {
        e.preventDefault();
        setPreviewOrientation((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal'));
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, [draggedShip]);

  // Проверка валидности установки
  const isValidPlacement = useCallback(
    (ship: Ship, row: number, col: number, orientation: Orientation): boolean => {
      const cells: Position[] = [];

      // Проверка границ
      for (let i = 0; i < ship.size; i++) {
        const r = orientation === 'horizontal' ? row : row + i;
        const c = orientation === 'horizontal' ? col + i : col;

        if (r < 0 || r >= 10 || c < 0 || c >= 10) return false;
        cells.push({ row: r, col: c });
      }

      // Проверка зоны 1 клетки вокруг
      const occupied = new Set(
        placedShips
          .filter((s) => s.id !== draggedFromField?.id)
          .flatMap((s) => {
            const cells: string[] = [];
            for (let i = 0; i < s.size; i++) {
              const r = s.orientation === 'horizontal' ? s.row : s.row + i;
              const c = s.orientation === 'horizontal' ? s.col + i : s.col;
              // Добавляем сам корабль и зону вокруг
              for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                  const nr = r + dr;
                  const nc = c + dc;
                  if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10) {
                    cells.push(`${nr},${nc}`);
                  }
                }
              }
            }
            return cells;
          }),
      );

      return cells.every((cell) => !occupied.has(`${cell.row},${cell.col}`));
    },
    [placedShips, draggedFromField],
  );

  // Выбор корабля из дока
  const handleSelectFromDock = (ship: Ship) => {
    if (ship.count > 0) {
      setDraggedShip(ship);
      setDraggedFromField(null);
      setPreviewOrientation('horizontal');
    }
  };

  // Клик по клетке поля
  const handleCellClick = (row: number, col: number) => {
    if (!draggedShip) {
      // Проверяем, есть ли тут корабль — можно взять обратно
      const shipHere = placedShips.find((s) => {
        for (let i = 0; i < s.size; i++) {
          const r = s.orientation === 'horizontal' ? s.row : s.row + i;
          const c = s.orientation === 'horizontal' ? s.col + i : s.col;
          if (r === row && c === col) return true;
        }
        return false;
      });

      if (shipHere) {
        // Возвращаем в док
        setShipsInDock((prev) =>
          prev.map((s) => (s.size === shipHere.size ? { ...s, count: s.count + 1 } : s)),
        );
        setPlacedShips((prev) => prev.filter((s) => s.id !== shipHere.id));
        setField((prev) => {
          const newField = createEmptyField();
          placedShips
            .filter((s) => s.id !== shipHere.id)
            .forEach((s) => {
              for (let i = 0; i < s.size; i++) {
                const r = s.orientation === 'horizontal' ? s.row : s.row + i;
                const c = s.orientation === 'horizontal' ? s.col + i : s.col;
                newField[r][c] = s.size as CellState;
              }
            });
          return newField;
        });
      }
      return;
    }

    // Установка корабля
    if (isValidPlacement(draggedShip, row, col, previewOrientation)) {
      const newShip: PlacedShip = {
        id: `${draggedShip.id}-${Date.now()}`,
        size: draggedShip.size,
        row,
        col,
        orientation: previewOrientation,
      };

      setPlacedShips((prev) => [...prev, newShip]);
      setField((prev) => {
        const newField = [...prev];
        for (let i = 0; i < draggedShip.size; i++) {
          const r = previewOrientation === 'horizontal' ? row : row + i;
          const c = previewOrientation === 'horizontal' ? col + i : col;
          newField[r][c] = draggedShip.size as CellState;
        }
        return newField;
      });

      // Уменьшаем счетчик в доке
      if (!draggedFromField) {
        setShipsInDock((prev) =>
          prev.map((s) => (s.size === draggedShip.size ? { ...s, count: s.count - 1 } : s)),
        );
      }

      setDraggedShip(null);
      setDraggedFromField(null);
      setHoveredCell(null);
    }
  };

  // Наведение на клетку
  const handleCellHover = (row: number, col: number) => {
    if (draggedShip) {
      setHoveredCell({ row, col });
    }
  };

  // Сброс
  const handleReset = () => {
    setField(createEmptyField());
    setPlacedShips([]);
    setShipsInDock(INITIAL_SHIPS);
    setDraggedShip(null);
    setDraggedFromField(null);
  };

  // Авто-расстановка (заглушка для бэкенда)
  const handleAutoPlace = async () => {
    // Здесь будет запрос к бэкенду
    // const response = await fetch('/api/auto-place', { method: 'POST', body: JSON.stringify({ strategy }) });
    // const newField: Field = await response.json();
    
    // Заглушка:
    const newField: Field = createEmptyField();
    // ... логика заполнения от бэкенда

    setField(newField);
    setPlacedShips([]); // Обновить после получения данных
    setShipsInDock(INITIAL_SHIPS.map((s) => ({ ...s, count: 0 })));
  };

  // Создание игры
  const handleCreate = async () => {
    const allShipsPlaced = shipsInDock.every((s) => s.count === 0);
    if (!allShipsPlaced) return;

    if (gameMode === 'player') {
      
      // sendMessage({field});
      setShowModal(true);
    } else {
      // Создание игры с ботом
      console.log('Создание игры с ботом:', { difficulty: botDifficulty, field });
    }
  };

  const canCreate = shipsInDock.every((s) => s.count === 0);

  // Получение цвета подсветки клетки
  const getCellHighlight = (row: number, col: number): string | null => {
    if (!draggedShip || !hoveredCell) return null;

    // Проверяем, входит ли клетка в зону корабля
    const shipCells: Position[] = [];
    for (let i = 0; i < draggedShip.size; i++) {
      const r = previewOrientation === 'horizontal' ? hoveredCell.row : hoveredCell.row + i;
      const c = previewOrientation === 'horizontal' ? hoveredCell.col + i : hoveredCell.col;
      shipCells.push({ row: r, col: c });
    }

    const isInShip = shipCells.some((c) => c.row === row && c.col === col);
    if (!isInShip) return null;

    const valid = isValidPlacement(
      draggedShip,
      hoveredCell.row,
      hoveredCell.col,
      previewOrientation,
    );
    return valid ? 'valid' : 'invalid';
  };

  return (
    <div className="game-setup">
      {/* Выбор режима */}
      <div className="mode-selector">
        <button className={gameMode === 'bot' ? 'active' : ''} onClick={() => setGameMode('bot')}>
          Игра с ботом
        </button>
        <button
          className={gameMode === 'player' ? 'active' : ''}
          onClick={() => setGameMode('player')}>
          Игра с игроком
        </button>
      </div>

      {/* Выбор сложности бота */}
      {gameMode === 'bot' && (
        <div className="difficulty-selector">
          <span>Сложность:</span>
          {(['easy', 'medium', 'hard'] as BotDifficulty[]).map((d) => (
            <button
              key={d}
              className={botDifficulty === d ? 'active' : ''}
              onClick={() => setBotDifficulty(d)}>
              {d === 'easy' ? 'Лёгкая' : d === 'medium' ? 'Средняя' : 'Сложная'}
            </button>
          ))}
        </div>
      )}

      {/* Игровое поле */}
      <div className="field-container">
        <div className="coordinates-top">
          {'ABCDEFGHIJ'.split('').map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <div className="field-wrapper">
          <div className="coordinates-left">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <span key={n}>{n}</span>
            ))}
            {/* {'12345678910'.match(/\d{1,1}/g)?.map(n => <span key={n}>{n}</span>)} */}
          </div>
          <div className="battle-field">
            {field.map((row, rIdx) => (
              <div key={rIdx} className="field-row">
                {row.map((cell, cIdx) => {
                  const highlight = getCellHighlight(rIdx, cIdx);
                  return (
                    <div
                      key={cIdx}
                      className={`field-cell ${cell > 0 ? 'has-ship' : ''} ${highlight || ''}`}
                      onClick={() => handleCellClick(rIdx, cIdx)}
                      onMouseEnter={() => handleCellHover(rIdx, cIdx)}>
                      {cell > 0 && <div className="ship-part" />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Док с кораблями */}
      <div className="ship-dock">
        <h4>Корабли для расстановки</h4>
        <div className="dock-ships">
          {shipsInDock.map(
            (ship) =>
              ship.count > 0 && (
                <DockShip key={ship.id} ship={ship} onSelect={handleSelectFromDock} />
              ),
          )}
        </div>
      </div>

      {/* Кнопки управления */}
      <div className="control-buttons">
        <button className="reset-btn" onClick={handleReset}>
          Сброс
        </button>
        <button className="auto-btn" onClick={handleAutoPlace}>
          Авто (стратегии)
        </button>
        <button
          className={`create-btn ${canCreate ? 'active' : ''}`}
          onClick={handleCreate}
          disabled={!canCreate}>
          Создать
        </button>
      </div>

      {/* Перетаскиваемый корабль */}
      {draggedShip && (
        <DraggedShip
          ship={draggedShip}
          orientation={previewOrientation}
          position={{ x: mousePos.x + 10, y: mousePos.y + 10 }}
        />
      )}

      {/* Модалка с кодом */}
      {showModal && <RoomCodeModal field={field} onClose={() => setShowModal(false)} />}

      <style>{`
        .game-setup {
          padding: 20px;
          background: #0f1419;
          min-height: 100vh;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          user-select: none;
        }

        .mode-selector, .difficulty-selector {
          display: flex;
          gap: 10px;
          background: #1a1f2e;
          padding: 10px;
          border-radius: 8px;
        }

        .mode-selector button, .difficulty-selector button {
          padding: 10px 20px;
          border: none;
          background: #2a3441;
          color: #8b9dc3;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .mode-selector button.active, .difficulty-selector button.active {
          background: #4ade80;
          color: #0f1419;
        }

        .field-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .coordinates-top {
          display: flex;
          margin-left: 40px;
        }

        .coordinates-top span {
          width: 40px;
          text-align: center;
          color: #8b9dc3;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .field-wrapper {
          display: flex;
        }

        .coordinates-left {
          display: flex;
          flex-direction: column;
          margin-right: 5px;
        }

        .coordinates-left span {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b9dc3;
          font-size: 12px;
        }

        .battle-field {
          display: flex;
          flex-direction: column;
          border: 2px solid #3a4150;
          background: #162035;
        }

        .field-row {
          display: flex;
        }

        .field-cell {
          width: 40px;
          height: 40px;
          border: 1px solid #3a4150;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s;
        }

        .field-cell.valid {
          background: rgba(74, 222, 128, 0.3);
          box-shadow: inset 0 0 0 2px #4ade80;
        }

        .field-cell.invalid {
          background: rgba(239, 68, 68, 0.3);
          box-shadow: inset 0 0 0 2px #ef4444;
        }

        .ship-part {
          width: 32px;
          height: 32px;
          background: #4ade80;
          border-radius: 4px;
        }

        .ship-dock {
          background: #1a1f2e;
          padding: 15px 25px;
          border-radius: 8px;
          text-align: center;
        }

        .ship-dock h4 {
          margin: 0 0 15px 0;
          color: #8b9dc3;
        }

        .dock-ships {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .dock-ship-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .ship-count {
          font-size: 12px;
          color: #8b9dc3;
        }

        .dock-ship {
          display: flex;
          gap: 2px;
          padding: 5px;
          background: #2a3441;
          border-radius: 4px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .dock-ship:hover {
          transform: scale(1.05);
          background: #3a4451;
        }

        .ship-cell {
          width: 36px;
          height: 36px;
          background: #4ade80;
          border-radius: 4px;
        }

        .dragged-ship {
          position: fixed;
          display: flex;
          gap: 2px;
          pointer-events: none;
          z-index: 1000;
          opacity: 0.8;
        }

        .control-buttons {
          display: flex;
          gap: 15px;
        }

        .control-buttons button {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .reset-btn {
          background: #ef4444;
          color: white;
        }

        .auto-btn {
          background: #3b82f6;
          color: white;
        }

        .create-btn {
          background: #6b7280;
          color: white;
          cursor: not-allowed;
        }

        .create-btn.active {
          background: #4ade80;
          color: #0f1419;
          cursor: pointer;
        }

        /* Модалка */
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
          min-width: 300px;
        }

        .modal-content h3 {
          margin: 0 0 15px 0;
          color: #4ade80;
        }

        .code-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #0f1419;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
        }

        .room-code {
          font-size: 24px;
          font-weight: bold;
          color: #4ade80;
          letter-spacing: 2px;
        }

        .copy-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .copy-btn:hover {
          background: #2a3441;
        }

        .ready-btn {
          padding: 12px 30px;
          background: #4ade80;
          color: #0f1419;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default GameSetup;
