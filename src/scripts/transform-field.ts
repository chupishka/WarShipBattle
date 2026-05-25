import { CELL_STATE } from '../pages/GameBoard/cell';


// Типы для отрисовки
export type RenderCellType = 
  | 'water'           // Чистая вода
  | 'miss'            // Промах
  | 'single-alive'    // Одинарный корабль целый
  | 'single-damaged'  // Одинарный корабль подбит
  | 'single-destroyed'// Одинарный корабль уничтожен
  | 'head-alive'      // Нос целый
  | 'head-damaged'    // Нос подбит
  | 'head-destroyed'  // Нос уничтожен
  | 'center-alive'    // Центр целый
  | 'center-damaged'  // Центр подбит
  | 'center-destroyed';// Центр уничтожен

export interface RenderCell {
  type: RenderCellType;
  rotation: number; // 0, 90, 180, 270 градусов
}

export type RenderField = RenderCell[][];

export type CellState = 0 | 1 | 2 | 3 | 4;
export type Field = CellState[][];

function isShipCell(state: CellState): boolean {
  return state === CELL_STATE.UNDAMAGED || 
         state === CELL_STATE.DAMAGED || 
         state === CELL_STATE.DESTROYED;
}

function getCellCondition(state: CellState): 'alive' | 'damaged' | 'destroyed' {
  if (state === CELL_STATE.UNDAMAGED) return 'alive';
  if (state === CELL_STATE.DAMAGED) return 'damaged';
  if (state === CELL_STATE.DESTROYED) return 'destroyed';
  return 'alive';
}

function isShipFullyDestroyed(field: Field, shipCells: [number, number][]): boolean {
  return shipCells.every(([r, c]) => field[r][c] === CELL_STATE.DESTROYED);
}

function findShipCells(field: Field, startRow: number, startCol: number): [number, number][] {
  const rows = field.length;
  const cols = field[0].length;
  const visited = new Set<string>();
  const shipCells: [number, number][] = [];
  const queue: [number, number][] = [[startRow, startCol]];

  visited.add(`${startRow},${startCol}`);

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    shipCells.push([r, c]);

    const neighbors: [number, number][] = [
      [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
    ];

    for (const [nr, nc] of neighbors) {
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && 
          !visited.has(`${nr},${nc}`) && 
          isShipCell(field[nr][nc])) {
        visited.add(`${nr},${nc}`);
        queue.push([nr, nc]);
      }
    }
  }

  return shipCells;
}

function getShipOrientation(shipCells: [number, number][]): 'horizontal' | 'vertical' | 'single' {
  if (shipCells.length === 1) return 'single';

  shipCells.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });

  const allSameRow = shipCells.every(([r]) => r === shipCells[0][0]);
  if (allSameRow) return 'horizontal';

  return 'vertical';
}

function getShipPart(
  shipCells: [number, number][], 
  cellRow: number, 
  cellCol: number,
  orientation: 'horizontal' | 'vertical' | 'single'
): 'head' | 'center' | 'single' {
  if (orientation === 'single') return 'single';

  const sorted = [...shipCells].sort((a, b) => {
    if (orientation === 'horizontal') return a[1] - b[1];
    return a[0] - b[0];
  });

  const index = sorted.findIndex(([r, c]) => r === cellRow && c === cellCol);

  if (index === 0 || index === sorted.length - 1) return 'head';
  return 'center';
}

function getHeadRotation(
  shipCells: [number, number][], 
  cellRow: number, 
  cellCol: number,
  orientation: 'horizontal' | 'vertical' | 'single'
): number {
  if (orientation === 'single') return 0;

  const sorted = [...shipCells].sort((a, b) => {
    if (orientation === 'horizontal') return a[1] - b[1];
    return a[0] - b[0];
  });

  const index = sorted.findIndex(([r, c]) => r === cellRow && c === cellCol);

  if (orientation === 'horizontal') {
    if (index === 0) return 270;
    return 90;
  } else {
    if (index === 0) return 0;
    return 180;
  }
}

function getCenterRotation(orientation: 'horizontal' | 'vertical' | 'single'): number {
  if (orientation === 'horizontal') return 90;
  return 0;
}

export function transformField(field: Field, isEnemyField: boolean = false): RenderField {
  const rows = field.length;
  const cols = field[0].length;

  const renderField: RenderField = Array(rows).fill(null).map(() => 
    Array(cols).fill(null).map(() => ({ type: 'water', rotation: 0 }))
  );

  const visitedShips = new Set<string>();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const state = field[r][c];

      if (state === CELL_STATE.MISS) {
        renderField[r][c] = { type: 'miss', rotation: 0 };
        continue;
      }

      if (state === CELL_STATE.EMPTY) {
        renderField[r][c] = { type: 'water', rotation: 0 };
        continue;
      }

      if (isShipCell(state)) {
        if (visitedShips.has(`${r},${c}`)) continue;

        const shipCells = findShipCells(field, r, c);

        for (const [sr, sc] of shipCells) {
          visitedShips.add(`${sr},${sc}`);
        }

        const orientation = getShipOrientation(shipCells);
        const fullyDestroyed = isShipFullyDestroyed(field, shipCells);

        for (const [sr, sc] of shipCells) {
          const cellState = field[sr][sc];
          const condition = getCellCondition(cellState);
          const part = getShipPart(shipCells, sr, sc, orientation);

          let renderType: RenderCellType;
          let rotation: number;

          if (part === 'single') {
            if (fullyDestroyed) {
              renderType = 'single-destroyed';
            } else if (condition === 'damaged') {
              renderType = 'center-damaged';
            } else {
              renderType = 'single-alive';
            }
            rotation = 0;
          } else if (part === 'head') {
            if (fullyDestroyed) {
              renderType = 'head-destroyed';
            } else if (condition === 'damaged') {
              renderType = 'center-damaged';
            } else {
              renderType = 'head-alive';
            }
            rotation = getHeadRotation(shipCells, sr, sc, orientation);
          } else {
            if (fullyDestroyed) {
              renderType = 'center-destroyed';
            } else if (condition === 'damaged') {
              renderType = 'center-damaged';
            } else {
              renderType = 'center-alive';
            }
            rotation = getCenterRotation(orientation);
          }

          renderField[sr][sc] = { type: renderType, rotation };
        }
      }
    }
  }

  return renderField;
}
