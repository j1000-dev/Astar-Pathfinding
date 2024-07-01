import { Node } from "@/types/Node";

export const astar = async (grid: Node[][], start: Node, end: Node) => {
    let openList: Node[] = [];
    let closeList = new Set<Node>();

    start.g = 0;
    start.h = calculateHScore(start, end);
    start.f = start.g + start.h
    openList.push(start)

    while (openList.length > 0) {
        openList.sort((a, b) => a.f - b.f);
        let curNode = openList.shift();
        if (!curNode) continue;
        if (curNode.row === end.row && curNode.col === end.col) { //path found
            return pathFound(curNode)
        }
        closeList.add(curNode);

        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [-1, -1], [-1, 1], [1, 1], [1, -1]]
        directions.forEach(async dir => {
            const newRow = curNode.row + dir[0]
            const newCol = curNode.col + dir[1]
            if (
                newRow < 0 ||
                newRow >= grid.length ||
                newCol < 0 ||
                newCol >= grid[0].length
            ) {
                return;
            }

            const node = grid[newRow][newCol];
            if (closeList.has(node) || node.type === 'wall') { //Node has already been visited or is a wall
                return;
            }

            let tentativeG = curNode.g + 1
            if (!openList.includes(node)) {
                openList.push(node)
            } else if (tentativeG >= curNode.g) {
                return;
            }

            node.parent = curNode;
            node.g = tentativeG;
            node.h = calculateHScore(node, end);
            node.f = node.g + node.h;
            if (node.type !== 'start' && node.type !== 'end') {
                node.type = 'visited'
            }
        })
    }
    alert("No path found!");
    return [] //No path found
}

const calculateHScore = (a: Node, b: Node): number => {
    const x = Math.abs(a.row - b.row)
    const y = Math.abs(a.col - b.col)
    return x + y
}

const pathFound = (end: Node) => {
    let path: Node[] = [];
    let current: Node | null = end;
    current = current.parent
    while (current?.parent) {
        path.push(current)
        current = current.parent;
    }
    return path.reverse();
}