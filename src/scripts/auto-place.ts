type ShipConfig = [number, number]; // [size, count]
type CellValue = 0 | 1 | 2 | 3 | 4;

interface Ship {
    size: number;
    coordinates: [number, number][];
    orientation: string;
}

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
    private ships: Ship[];

    constructor(fieldSize: number = 10) {
        this.fieldSize = fieldSize;
        this.field = [];
        this.forbiddenCells = new Set();
        this.ships = [];
    }

    public placeShipsRandomly(): CellValue[][] {
        this.initializeField();
        this.forbiddenCells = new Set();
        this.ships = [];

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

    public placeShipsPerelman(): CellValue[][] {
        this.placePerelman();
        return this.field;
    }

    private placePerelman(): Ship[] {
        this.ships = [];
        this.field = Array(this.fieldSize).fill(null).map(
            () => Array(this.fieldSize).fill(0 as CellValue)
        );
        this.forbiddenCells = new Set<string>();
        
        // Choose edge for large ships (0=top, 1=right, 2=bottom, 3=left)
        const edge = Math.floor(Math.random() * 4);
        
        // First, place large ships (4 and 3-deck) near the edge
        const bigShipsConfig = RandomShipPlacer.SHIPS_CONFIG.filter(
            ([size, count]: [number, number]) => size >= 3
        );
        const smallShipsConfig = RandomShipPlacer.SHIPS_CONFIG.filter(
            ([size, count]: [number, number]) => size < 3
        );
        
        // Place large ships near the edge
        for (const [shipSize, count] of bigShipsConfig) {
            for (let i = 0; i < count; i++) {
                let ship = this.tryPlaceNearEdge(shipSize, edge);
                if (ship === null) {
                    // If failed near the edge - try randomly
                    ship = this.tryPlaceShipRandom(shipSize);
                }
                if (ship === null) {
                    return this.placePerelman(); // Restart
                }
                this.ships.push(ship);
            }
        }
        
        // Place small ships in remaining space (away from edge)
        for (const [shipSize, count] of smallShipsConfig) {
            for (let i = 0; i < count; i++) {
                let ship = this.tryPlaceAwayFromEdge(shipSize, edge);
                if (ship === null) {
                    ship = this.tryPlaceShipRandom(shipSize);
                }
                if (ship === null) {
                    return this.placePerelman(); // Restart
                }
                this.ships.push(ship);
            }
        }
        
        return this.ships;
    }

    private tryPlaceNearEdge(size: number, edge: number): Ship | null {
        const orientations = this.getOrientationsForEdge(edge);
        
        for (let attempt = 0; attempt < 50; attempt++) {
            const orientation = orientations[Math.floor(Math.random() * orientations.length)];
            
            let x: number, y: number;
            const nearOffset = Math.floor(Math.random() * 3); // 0, 1 или 2 клетки от края
            
            switch (edge) {
                case 0: // top
                    x = Math.floor(Math.random() * this.fieldSize);
                    y = nearOffset;
                    break;
                case 1: // right
                    x = this.fieldSize - 1 - nearOffset;
                    y = Math.floor(Math.random() * this.fieldSize);
                    break;
                case 2: // bottom
                    x = Math.floor(Math.random() * this.fieldSize);
                    y = this.fieldSize - 1 - nearOffset;
                    break;
                case 3: // left
                    x = nearOffset;
                    y = Math.floor(Math.random() * this.fieldSize);
                    break;
                default:
                    x = Math.floor(Math.random() * this.fieldSize);
                    y = Math.floor(Math.random() * this.fieldSize);
            }
            
            const deckCoordinates = this.calculateDeckCoordinates(x, y, size, orientation);
            
            if (this.isValidPlacement(deckCoordinates)) {
                this.placeShipOnField(deckCoordinates, size as CellValue);
                return { size, coordinates: deckCoordinates, orientation };
            }
        }
        
        return null;
    }

    private tryPlaceAwayFromEdge(size: number, edge: number): Ship | null {
        const orientations = ['UP', 'RIGHT', 'DOWN', 'LEFT'] as const;
        const margin = 3; // Минимальное расстояние от края
        
        for (let attempt = 0; attempt < 50; attempt++) {
            const orientation = orientations[Math.floor(Math.random() * orientations.length)];
            
            let x: number, y: number;
            
            switch (edge) {
                case 0: // away from top
                    x = Math.floor(Math.random() * this.fieldSize);
                    y = margin + Math.floor(Math.random() * Math.max(1, this.fieldSize - margin));
                    break;
                case 1: // away from right
                    x = Math.floor(Math.random() * Math.max(1, this.fieldSize - margin));
                    y = Math.floor(Math.random() * this.fieldSize);
                    break;
                case 2: // away from bottom
                    x = Math.floor(Math.random() * this.fieldSize);
                    y = Math.floor(Math.random() * Math.max(1, this.fieldSize - margin));
                    break;
                case 3: // away from left
                    x = margin + Math.floor(Math.random() * Math.max(1, this.fieldSize - margin));
                    y = Math.floor(Math.random() * this.fieldSize);
                    break;
                default:
                    x = Math.floor(Math.random() * this.fieldSize);
                    y = Math.floor(Math.random() * this.fieldSize);
            }
            
            const deckCoordinates = this.calculateDeckCoordinates(x, y, size, orientation);
            
            if (this.isValidPlacement(deckCoordinates)) {
                this.placeShipOnField(deckCoordinates, size as CellValue);
                return { size, coordinates: deckCoordinates, orientation };
            }
        }
        
        return null;
    }

    private tryPlaceShipRandom(size: number): Ship | null {
        const orientations = ['UP', 'RIGHT', 'DOWN', 'LEFT'] as const;
        
        for (let attempt = 0; attempt < 100; attempt++) {
            const orientation = orientations[Math.floor(Math.random() * orientations.length)];
            const x = Math.floor(Math.random() * this.fieldSize);
            const y = Math.floor(Math.random() * this.fieldSize);
            
            const deckCoordinates = this.calculateDeckCoordinates(x, y, size, orientation);
            
            if (this.isValidPlacement(deckCoordinates)) {
                this.placeShipOnField(deckCoordinates, size as CellValue);
                return { size, coordinates: deckCoordinates, orientation };
            }
        }
        
        return null;
    }

    private getOrientationsForEdge(edge: number): string[] {
        switch (edge) {
            case 0: return ['RIGHT', 'LEFT', 'DOWN'];  // top — горизонтально или вниз
            case 1: return ['UP', 'DOWN', 'LEFT'];     // right — вертикально или влево
            case 2: return ['RIGHT', 'LEFT', 'UP'];    // bottom — горизонтально или вверх
            case 3: return ['UP', 'DOWN', 'RIGHT'];    // left — вертикально или вправо
            default: return ['UP', 'RIGHT', 'DOWN', 'LEFT'];
        }
    }

    private isValidPlacement(deckCoordinates: [number, number][]): boolean {
        for (const [nx, ny] of deckCoordinates) {
            if (nx < 0 || nx >= this.fieldSize || ny < 0 || ny >= this.fieldSize) {
                return false;
            }
            if (!this.canPlaceDeck(nx, ny)) {
                return false;
            }
        }
        return true;
    }

    private tryPlaceShip(size: number, maxAttempts: number = 100): boolean {
        const orientations = ['UP', 'RIGHT', 'DOWN', 'LEFT'] as const;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const orientation = orientations[Math.floor(Math.random() * orientations.length)];
            const x = Math.floor(Math.random() * this.fieldSize);
            const y = Math.floor(Math.random() * this.fieldSize);

            const deckCoordinates = this.calculateDeckCoordinates(x, y, size, orientation);
            
            if (this.isValidPlacement(deckCoordinates)) {
                this.placeShipOnField(deckCoordinates, size as CellValue);
                return true;
            }
        }

        return false;
    }

    private initializeField(): void {
        this.field = Array(this.fieldSize)
            .fill(null)
            .map(() => Array(this.fieldSize).fill(0 as CellValue));
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
        const key = `${x},${y}`;
        if (this.forbiddenCells.has(key)) {
            return false;
        }

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
            this.field[x][y] = shipValue;

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

export function AutoPlacePerelman(): CellValue[][] {
    const placer = new RandomShipPlacer(10);
    return placer.placeShipsPerelman();
}

// Примеры использования:
// const field = AutoPlace();
// console.log(field.map(row => row.join(' ')).join('\n'));
// 
// const perelmanField = AutoPlacePerelman();
// console.log(perelmanField.map(row => row.join(' ')).join('\n'));