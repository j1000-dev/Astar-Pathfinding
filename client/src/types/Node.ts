export type CellType = 'empty' | 'start' | 'end' | 'wall' | 'path';

export interface Node {
    row: number;
    col: number;
    f: number;
    g: number;
    h: number;
    type: CellType;
    parent: Node | null;
}