
export type Orientation = 'horizontal' | 'vertical';

export interface SetupRenderCell {
  type: 'single' | 'head' | 'center';
  rotation: number;
}

export const IMAGE_MAP = {
  'water': '/img/ships/water.png',              // ← добавлено
  'single': '/img/ships/1_ship.png',
  'head': '/img/ships/ship_bow.png',
  'center': '/img/ships/ship_mid.png'
} as const;

/**
 * Определяет, что рисовать в клетке поля расстановки по placedShips
 */
export function getSetupCellRender(
  placedShips: { size: number; row: number; col: number; orientation: Orientation }[],
  row: number,
  col: number
): SetupRenderCell | null {
  for (const ship of placedShips) {
    for (let i = 0; i < ship.size; i++) {
      const r = ship.orientation === 'horizontal' ? ship.row : ship.row + i;
      const c = ship.orientation === 'horizontal' ? ship.col + i : ship.col;
      
      if (r === row && c === col) {
        if (ship.size === 1) {
          return { type: 'single', rotation: 0 };
        }
        
        const isFirst = i === 0;
        const isLast = i === ship.size - 1;
        
        if (isFirst || isLast) {
          let rotation = 0;
          if (ship.orientation === 'horizontal') {
            rotation = isFirst ? 270 : 90;
          } else {
            rotation = isFirst ? 0 : 180;
          }
          return { type: 'head', rotation };
        } else {
          const rotation = ship.orientation === 'horizontal' ? 90 : 0;
          return { type: 'center', rotation };
        }
      }
    }
  }
  return null;
}

/**
 * Парсит поле (где значения = размер корабля) в массив placedShips
 */
export function parseFieldToPlacedShips(
  field: number[][]
): { id: string; size: number; row: number; col: number; orientation: Orientation }[] {
  const rows = field.length;
  const cols = field[0].length;
  const visited = new Set<string>();
  const ships: { id: string; size: number; row: number; col: number; orientation: Orientation }[] = [];
  let idCounter = 0;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const size = field[r][c];
      if (size === 0 || visited.has(`${r},${c}`)) continue;
      
      let isHorizontal = true;
      for (let i = 1; i < size; i++) {
        if (c + i >= cols || field[r][c + i] !== size) {
          isHorizontal = false;
          break;
        }
      }
      
      if (isHorizontal) {
        for (let i = 0; i < size; i++) visited.add(`${r},${c + i}`);
        ships.push({ 
          id: `auto-${idCounter++}`, 
          size, 
          row: r, 
          col: c, 
          orientation: 'horizontal' 
        });
      } else {
        for (let i = 0; i < size; i++) visited.add(`${r + i},${c}`);
        ships.push({ 
          id: `auto-${idCounter++}`, 
          size, 
          row: r, 
          col: c, 
          orientation: 'vertical' 
        });
      }
    }
  }
  
  return ships;
}