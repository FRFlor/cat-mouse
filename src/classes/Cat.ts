import GridCell from './GridCell';
import Graph from './Graph';
// @ts-ignore
import {CellContent} from '@/components/MazeCell';
import PathFinder from '@/classes/PathFinder';
import GraphNode from '@/classes/GraphNode';

interface MoveStrategy {
    targets: GridCell[];
    path: GridCell[];
}

export default class Cat {
    public cell: GridCell;
    private grid: GridCell[];
    private graph: Graph;
    private desiredPath: GridCell[] = [];

    constructor(startCatCell: GridCell, grid: GridCell[]) {
        this.grid = grid;
        this.cell = startCatCell;
        this.graph = new Graph(this.grid);
    }

    // Moves the cat towards the target
    // Returns FALSE if the cat can no longer move
    public move(): boolean {
        const nextCellToMove: GridCell | undefined = this.desiredPath.shift();

        if (nextCellToMove === undefined) {
            return false;
        }

        this.cell.content = CellContent.Nothing;
        nextCellToMove.content = CellContent.Cat;
        this.cell = nextCellToMove;

        return true;
    }

    private get thereAreNoTargetsLeft(): boolean {
        return this.milkCells.length === 0 && this.mouseCell === undefined;
    }

    private get milkCells(): GridCell[] {
        return this.grid.filter((cell: GridCell) => cell.content === CellContent.Milk);
    }

    private get mouseCell(): GridCell | undefined {
        return this.grid.find((cell: GridCell) => cell.content === CellContent.Mouse);
    }

    public start() {
        this.graph.compose();
        this.desiredPath = this.getShortestPath();
    }

    public setCourseTo(destination: GridCell) {
        this.desiredPath = this.getPath(this.cell, destination);

    }

    private getPath(from: GridCell, to: GridCell): GridCell[] {
        return PathFinder.getPath(
            this.graph.toGraphNode(from),
            this.graph.toGraphNode(to),
            this.graph,
        ).map((graphNode: GraphNode) => this.graph.toGridCell(graphNode));
    }

    private getShortestPath(): GridCell[] {
        // With no mouse, there's no path
        if (this.mouseCell === undefined) {
            return [];
        }

        // With just a mouse, there's only one obvious shortest path
        const milkCell: GridCell | undefined = this.milkCells.shift();
        if (milkCell === undefined) {
            return this.getPath(this.cell, this.mouseCell);
        }

        const allStrategies: MoveStrategy[] = [];

        // Consider all possible ordering of capturing the milk
        // Each of those orders is a new strategy for the cat
        const permutation = require('array-permutation');
        const iterator = permutation(this.milkCells);
        for (const targets of iterator) {
            targets.push(this.mouseCell); // The mouse is always the last target
            allStrategies.push({
                targets,
                path: [],
            });
        }

        // If there were no permutations generated
        // it means that there's only a single milk and a mouse.
        if (allStrategies.length === 0) {
            allStrategies.push({
                targets: [milkCell, this.mouseCell],
                path: [],
            });
        }

        // If one of the milks or the mouse are unreachable, give up
        let isImpossible: boolean = false;

        // @ts-ignore
        const mousePosition: number = this.mouseCell.position;

        // Test each strategy and see how many moves each of them need
        allStrategies.forEach((strategy: MoveStrategy) => {
            let currentPosition = this.cell;
            let mouseWasEatenByAccident: boolean = false;
            strategy.targets.forEach((target: GridCell) => {
                if (target.position === mousePosition && mouseWasEatenByAccident) {
                    return;
                }

                if (isImpossible) {
                    return;
                }

                const pathForTarget: GridCell[] = this.getPath(currentPosition, target);
                if (pathForTarget.length === 0) {
                    strategy.path = [];
                    isImpossible = true;
                    return;
                }

                // Poor mouse got eaten by accident
                if (pathForTarget.find((cell: GridCell) => cell.position === mousePosition) !== undefined) {
                    mouseWasEatenByAccident = true;
                }

                strategy.path.push(...pathForTarget);
                currentPosition = strategy.path[strategy.path.length - 1];
            });
        });

        if (isImpossible) {
            return [];
        }

        // Sort strategies by number of moves needed for victory
        allStrategies.sort((a: MoveStrategy, b: MoveStrategy) => {
            if (a.path.length === b.path.length) {
                return 0;
            }

            return a.path.length < b.path.length ? -1 : 1;
        });

        // Return the best one
        return allStrategies[0].path;
    }
}
