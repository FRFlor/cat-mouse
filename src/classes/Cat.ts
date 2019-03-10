import GridCell from './GridCell';
import Graph from './Graph';
// @ts-ignore
import {CellContent} from '@/components/MazeCell';
import PathFinder from '@/classes/PathFinder';
import GraphNode from '@/classes/GraphNode';

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
            if (this.thereAreNoTargetsLeft) {
                return false;
            }

            if (this.milkCells.length > 0) {
                // @ts-ignore
                this.setCourseTo(this.milkCells.shift());
                return this.move();
            }

            // @ts-ignore
            this.setCourseTo(this.mouseCell);
            return this.move();
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
        this.desiredPath = [];
    }

    public setCourseTo(targetCell: GridCell) {
        this.desiredPath = PathFinder.getPath(
            this.graph.toGraphNode(this.cell),
            this.graph.toGraphNode(targetCell),
            this.graph,
        ).map((graphNode: GraphNode) => this.graph.toGridCell(graphNode));
    }
}
