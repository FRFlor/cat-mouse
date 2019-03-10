import GridCell from './GridCell';

export default class GraphNode {
    public cell: GridCell;
    public neighbors: GraphNode[] = [];

    constructor(cell: GridCell) {
        this.cell = cell;
    }

    public isNeighborOf(node: GraphNode): boolean {
        return Math.abs(this.cell.coordinates.row - node.cell.coordinates.row)
            + Math.abs(this.cell.coordinates.column - node.cell.coordinates.column) === 1;
    }
}
