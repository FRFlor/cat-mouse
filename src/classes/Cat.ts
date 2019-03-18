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
    private unreacheableTargets: GridCell[] = [];

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
            window.dispatchEvent(new Event('cat-finished'));
            return false;
        }

        this.cell.content = CellContent.Nothing;
        nextCellToMove.content = CellContent.Cat;
        this.cell = nextCellToMove;

        return true;
    }

    private get allMilkCells(): GridCell[] {
        return this.grid.filter((cell: GridCell) => cell.content === CellContent.Milk);
    }

    private get reachableMilkCells(): GridCell[] {
        return this.allMilkCells.filter((cell: GridCell) => this.unreacheableTargets.indexOf(cell) === -1);
    }

    private get mouseCell(): GridCell | undefined {
        return this.grid.find((cell: GridCell) => cell.content === CellContent.Mouse);
    }

    private get reachableMouseCell(): GridCell | undefined {
        // No mouse cell?
        if (this.mouseCell === undefined) {
            return undefined;
        }

        return this.unreacheableTargets.indexOf(this.mouseCell) === -1
            ? this.mouseCell
            : undefined; // Mouse cell is unreachable
    }

    public start(): void {
        this.graph.compose(); // Build Graph
        this.unreacheableTargets = this.getUnreachableTargets();
        this.getShortestPath();
    }

    private getUnreachableTargets(): GridCell[] {
        const allTargets = this.allMilkCells;
        if (this.mouseCell !== undefined) {
            allTargets.push(this.mouseCell);
        }

        return allTargets.filter((target: GridCell) => this.getPath(this.cell, target).length === 0);
    }

    private getPath(from: GridCell, to: GridCell): GridCell[] {
        return PathFinder.getPath(
            this.graph.toGraphNode(from),
            this.graph.toGraphNode(to),
            this.graph,
        ).map((graphNode: GraphNode) => this.graph.toGridCell(graphNode));
    }

    private getShortestPath() {
        // With no reachable mouse or milk, just give up
        if (this.reachableMouseCell === undefined && this.reachableMilkCells.length === 0) {
            this.desiredPath = [];
            window.dispatchEvent(new Event('cat-ready'));
            return;
        }

        const allStrategies: MoveStrategy[] = [];

        // Consider all possible ordering of capturing the milk
        // Each of those orders is a new strategy for the cat
        const permutation = require('array-permutation');
        const iterator = permutation(this.reachableMilkCells);
        for (const targets of iterator) {
            // If the mouse is reachable, make it the last target
            if (this.reachableMouseCell !== undefined) {
                targets.push(this.reachableMouseCell);
            }

            allStrategies.push({
                targets,
                path: [],
            });
        }

        // If there were no permutations generated
        // it means that there's only a single path.
        if (allStrategies.length === 0) {
            const targets = this.reachableMilkCells;
            if (this.reachableMouseCell !== undefined) {
                targets.push(this.reachableMouseCell);
            }

            allStrategies.push({
                targets,
                path: [],
            });
        }

        const mousePosition: number = (this.reachableMouseCell === undefined)
            ? -1
            : this.reachableMouseCell.position;

        // Test each strategy and see how many moves each of them need
        allStrategies.forEach((strategy: MoveStrategy, index: number) => {
            setTimeout(() => {
                let currentPosition = this.cell;
                let mouseWasEatenByAccident: boolean = false;
                strategy.targets.forEach((target: GridCell) => {
                    if (target.position === mousePosition && mouseWasEatenByAccident) {
                        return;
                    }

                    const pathForTarget: GridCell[] = this.getPath(currentPosition, target);

                    // Check to see if the poor mouse got eaten by accident
                    if (pathForTarget.find((cell: GridCell) => cell.position === mousePosition) !== undefined) {
                        mouseWasEatenByAccident = true;
                    }

                    strategy.path.push(...pathForTarget);
                    currentPosition = strategy.path[strategy.path.length - 1];
                });

                window.dispatchEvent(new CustomEvent('cat-analyzing-path', {
                    detail: {
                        progress: Math.floor(100 * index / (allStrategies.length - 1)),
                    },
                }));

                if (index === allStrategies.length - 1) {
                    // Sort strategies by number of moves needed for victory
                    allStrategies.sort((a: MoveStrategy, b: MoveStrategy) => {
                        if (a.path.length === b.path.length) {
                            return 0;
                        }

                        return a.path.length < b.path.length ? -1 : 1;
                    });

                    this.desiredPath = allStrategies[0].path;
                    window.dispatchEvent(new Event('cat-ready'));
                }
            }, 0);
        });
    }
}
