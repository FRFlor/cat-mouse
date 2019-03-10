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
            return false;
        }

        this.cell.content = CellContent.Nothing;
        nextCellToMove.content = CellContent.Cat;
        this.cell = nextCellToMove;

        return true;
    }

    public start() {
        this.graph.compose();
        const ratCell: GridCell | undefined = this.grid.find((cell: GridCell) => cell.content === CellContent.Mouse);
        const catCell: GridCell = this.cell;
        if (ratCell === undefined) {
            throw new DOMException('A rat must be present on the grid!');
        }

        this.desiredPath = PathFinder.getPath(
            this.graph.toGraphNode(catCell),
            this.graph.toGraphNode(ratCell),
            this.graph,
        ).map((graphNode: GraphNode) => this.graph.toGridCell(graphNode));
    }
}
