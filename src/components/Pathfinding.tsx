import { useState } from "react";
import { CellType, Node } from "@/types/Node";
import { astar } from '@/algo/astar';
import Canvas from "./Canvas";

export default function Pathfinding() {
    const numRows = 20;
    const numCols = 20;
    //Create our initial grid
    const [grid, setGrid] = useState<Node[][]>(() => {
        const initGrid: Node[][] = []
        for (let row = 0; row < numRows; row++) {
            const curRow: Node[] = [];
            for (let col = 0; col < numCols; col++) {
                curRow.push({ row, col, f: 0, g: 0, h: 0, type: 'empty', parent: null })
            }
            initGrid.push(curRow)
        }
        return initGrid;
    });
    const [start, setStart] = useState<Node | null>(null);
    const [end, setEnd] = useState<Node | null>(null);
    const [creatingWalls, setCreatingWalls] = useState(false);
    const [removingWalls, setRemovingWalls] = useState(false);
    const [hasDragged, setHasDragged] = useState(false);

    const updateGrid = (row: number, col: number, type: CellType) => {
        if (start && type === 'start') {
            grid[start.row][start.col].type = 'empty'
        }
        if (end && type === 'end') {
            grid[end.row][end.col].type = 'empty'
        }
        const newGrid = grid.slice(); //shallow copy of grid
        const cell = newGrid[row][col];
        newGrid[row][col] = { ...cell, type };
        setGrid(newGrid);
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const row = Math.floor(y / 25);
        const col = Math.floor(x / 25);

        setHasDragged(false);

        if (e.button === 0) { // Left click
            if (!start) {
                setStart(grid[row][col]);
                updateGrid(row, col, 'start');
            } else {
                setCreatingWalls(true);
                updateGrid(row, col, 'wall');
            }
        } else if (e.button === 2) { // Right click
            if (!end) {
                setEnd(grid[row][col]);
                updateGrid(row, col, 'end');
            } else {
                setRemovingWalls(true);
                updateGrid(row, col, 'empty');
            }
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!creatingWalls && !removingWalls) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const row = Math.floor(y / 25);
        const col = Math.floor(x / 25);

        setHasDragged(true);

        if (creatingWalls) {
            updateGrid(row, col, 'wall');
        } else if (removingWalls) {
            updateGrid(row, col, 'empty');
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        setCreatingWalls(false);
        setRemovingWalls(false);

        if (!hasDragged) { // Left click and not dragged
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const row = Math.floor(y / 25);
            const col = Math.floor(x / 25);

            if (e.button === 0) {
                setStart(grid[row][col]);
                updateGrid(row, col, 'start');
            } else if (e.button == 2) {
                setEnd(grid[row][col]);
                updateGrid(row, col, 'end');
            }
        }
    }

    const visualizePath = async() => {
        if (start && end) {
            const path = await astar(grid, start, end);
            for (const node of path) {
                updateGrid(node.row, node.col, 'path');
            }
        }
    }

    return (
        <div>
            <Canvas
                grid={grid}
                handleMouseDown={handleMouseDown}
                handleMouseMove={handleMouseMove}
                handleMouseUp={handleMouseUp}
            />
            <div className="flex flex-col items-center">
                <button
                    type="button"
                    onClick={() => visualizePath()}
                    className="
                        text-white
                        bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700
                        focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800
                        font-medium rounded-lg text-sm 
                        px-5 py-2.5 m-5"
                >
                    Visualize!
                </button>
                <div className="text-lg font-bold underline">Instructions</div>
                <ul className="list-disc">
                    <li>Left click to set a starting point</li>
                    <li>Right click to set an end point</li>
                    <li>Left click and drag to create walls</li>
                    <li>Right click and drag to remove walls</li>
                    <li>Click on "Visualize!" to view the A* Pathfinding algorithm in action</li>
                </ul>
            </div>
        </div>
    )
}
