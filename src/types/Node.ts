export type CellType = 'empty' | 'start' | 'end' | 'wall' | 'path' | 'visited';

export interface Node {
    row: number;
    col: number;
    f: number;
    g: number;
    h: number;
    type: CellType;
    parent: Node | null;
}