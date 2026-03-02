type ShipConfig = [number, number]; // [size, count]
type CellValue = 0 | 1 | 2 | 3 | 4;

export class RandomShipPlacer {
    private static readonly SHIPS_CONFIG: ShipConfig[] = [
        [4, 1],  // 1 корабль на 4 палубы
        [3, 2],  // 2 корабля на 3 палубы
        [2, 3],  // 3 корабля на 2 палубы
        [1, 4],  // 4 корабля на 1 палубу
    ];

    private fieldSize: number;
    private field: CellValue[][];
    private forbiddenCells: Set<string>;

    constructor(fieldSize: number = 10) {
        this.fieldSize = fieldSize;
        this.field = [];
        this.forbiddenCells = new Set();
    }

    public placeShipsRandomly(): CellValue[][] {
        this.initializeField();
        this.forbiddenCells = new Set();

        // Размещаем корабли от большего к меньшему
        const sortedConfig = [...RandomShipPlacer.SHIPS_CONFIG].sort((a, b) => b[0] - a[0]);
        
        for (const [shipSize, count] of sortedConfig) {
            for (let i = 0; i < count; i++) {
                const placed = this.tryPlaceShip(shipSize);
                if (!placed) {
                    // Если не получилось разместить, пробуем заново
                    return this.placeShipsRandomly();
                }
            }
        }

        return this.field;
    }

    private initializeField(): void {
        this.field = Array(this.fieldSize)
            .fill(null)
            .map(() => Array(this.fieldSize).fill(0 as CellValue));
    }

    private tryPlaceShip(size: number, maxAttempts: number = 100): boolean {
        const orientations = ['UP', 'RIGHT', 'DOWN', 'LEFT'] as const;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            // Случайно выбираем ориентацию
            const orientation = orientations[Math.floor(Math.random() * orientations.length)];
            
            // Случайно выбираем начальные координаты
            const x = Math.floor(Math.random() * this.fieldSize);
            const y = Math.floor(Math.random() * this.fieldSize);

            // Вычисляем координаты палуб корабля
            const deckCoordinates = this.calculateDeckCoordinates(x, y, size, orientation);
            
            // Проверяем валидность размещения
            let valid = true;
            for (const [nx, ny] of deckCoordinates) {
                // Проверяем границы поля
                if (nx < 0 || nx >= this.fieldSize || ny < 0 || ny >= this.fieldSize) {
                    valid = false;
                    break;
                }

                // Проверяем, можно ли поставить палубу здесь
                if (!this.canPlaceDeck(nx, ny)) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                // Размещаем корабль
                this.placeShipOnField(deckCoordinates, size as CellValue);
                return true;
            }
        }

        return false;
    }

    private calculateDeckCoordinates(
        startX: number, 
        startY: number, 
        size: number, 
        orientation: string
    ): [number, number][] {
        const coordinates: [number, number][] = [];
        
        for (let i = 0; i < size; i++) {
            let x = startX;
            let y = startY;

            switch (orientation) {
                case 'UP':
                    y -= i;
                    break;
                case 'RIGHT':
                    x += i;
                    break;
                case 'DOWN':
                    y += i;
                    break;
                case 'LEFT':
                    x -= i;
                    break;
            }
            
            coordinates.push([x, y]);
        }
        
        return coordinates;
    }

    private canPlaceDeck(x: number, y: number): boolean {
        // Проверяем, не запрещена ли клетка
        const key = `${x},${y}`;
        if (this.forbiddenCells.has(key)) {
            return false;
        }

        // Проверяем все соседние клетки (включая диагональные)
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < this.fieldSize && ny >= 0 && ny < this.fieldSize) {
                    if (this.field[nx][ny] !== 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    private placeShipOnField(deckCoordinates: [number, number][], shipValue: CellValue): void {
        for (const [x, y] of deckCoordinates) {
            // Устанавливаем значение корабля (1, 2, 3 или 4)
            this.field[x][y] = shipValue;

            // Добавляем в запретные все клетки вокруг палубы (включая саму палубу)
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < this.fieldSize && ny >= 0 && ny < this.fieldSize) {
                        this.forbiddenCells.add(`${nx},${ny}`);
                    }
                }
            }
        }
    }
}


export function AutoPlace(): CellValue[][] {
    const placer = new RandomShipPlacer(10);
    return placer.placeShipsRandomly();
}

// Пример использования:
// const field = createShipsField();
// console.log(field.map(row => row.join(' ')).join('\n'));