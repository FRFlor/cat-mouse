import GridCell from './GridCell';
import Graph from './Graph';
// @ts-ignore
import {CellContent} from '@/components/MazeCell';
import PathFinder from '@/classes/PathFinder';
import GraphNode from '@/classes/GraphNode';

export default class Cat {
    private grid: GridCell[];
    private startCell: GridCell;
    private graph: Graph;
    private desiredPath: GridCell[] = [];

    constructor(startCatCell: GridCell, grid: GridCell[]) {
        this.grid = grid;
        this.startCell = startCatCell;
        this.graph = new Graph(this.grid);
    }

    public getNewPosition(): number {
        const nextCellToMove: GridCell | undefined = this.desiredPath.shift();

        return  nextCellToMove === undefined ? -1 : nextCellToMove.position;
    }

    public start() {
        this.graph.compose();
        const ratCell: GridCell | undefined = this.grid.find((cell: GridCell) => cell.content === CellContent.Mouse);
        const catCell: GridCell = this.startCell;

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
