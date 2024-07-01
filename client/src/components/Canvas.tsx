import { Node } from "@/types/Node";
import { useRef, useEffect } from "react";

interface CanvasProps {
    grid: Node[][],
    handleMouseDown: (e: React.MouseEvent) => void,
    handleMouseMove: (e: React.MouseEvent) => void,
    handleMouseUp: (e: React.MouseEvent) => void
}
export default function Canvas({grid, handleMouseDown, handleMouseMove, handleMouseUp} : CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for (let row = 0; row < grid.length; row++) {
                for (let col = 0; col < grid[0].length; col++) {
                    const node = grid[row][col]
                    const color = getColor(node.type);
                    ctx.fillStyle = color;
                    ctx.fillRect(col * 25, row * 25, 25, 25);
                    ctx.strokeRect(col * 25, row * 25, 25, 25); //x,y,width,height

                    if (node.type !== 'empty' && node.type !== 'wall') {
                        ctx.fillStyle = 'black';
                        ctx.font = '10px Arial';
                        ctx.fillText(`f:${node.f}`, col * 25 + 5, row * 25 + 15); // Top-left corner
                        ctx.fillText(`g:${node.g}`, col * 25 + 5, row * 25 + 45); // Bottom-left corner
                        ctx.fillText(`h:${node.h}`, col * 25 + 25, row * 25 + 45); // Bottom-right corner
                    }
                }
            }
        }
    }, [grid]);

    return (
        <canvas
            ref={canvasRef}
            width={500}
            height={500}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()} //Prevent menu from opening on right click
        >
        </canvas>
    )
}

const getColor = (type: string) => {
    switch (type) {
        case 'start':
            return 'green'
        case 'end':
            return 'red';
        case 'wall':
            return 'gray';
        case 'path':
            return 'blue';
        case 'visited':
            return 'yellow';
        default:
            return 'white';
    }
}