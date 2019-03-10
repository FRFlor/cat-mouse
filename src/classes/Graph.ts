import GridCell from './GridCell';
import GraphNode from './GraphNode';
// @ts-ignore
import {CellContent} from '../components/MazeGrid.vue';

export default class Graph {
    public nodes: GraphNode[] = [];
    private grid: GridCell[];

    constructor(referenceGrid: GridCell[]) {
        this.grid = referenceGrid;
    }

    public compose() {
        this.nodes = [];
        // Creating Nodes (Neighbors not yet defined)
        this.grid.forEach((cell: GridCell) => {
            if (cell.content !== CellContent.Wall) {
                this.nodes.push(new GraphNode(cell));
            }
        });

        // Determining Neighbors
        this.nodes.forEach((node: GraphNode) => {
            this.nodes.forEach((otherNode: GraphNode) => {
                if (node.isNeighborOf(otherNode)) {
                    node.neighbors.push(otherNode);
                }
            });
        });
    }

    public toGraphNode(source: GridCell): GraphNode {
        const conversion: GraphNode | undefined = this.nodes.find((node: GraphNode) => {
            return node.cell.position === source.position;
        });

        if (conversion === undefined) {
            throw new DOMException('Impossible conversion from GridCell to GraphNode');
        }

        return conversion;
    }

    public toGridCell(source: GraphNode): GridCell {
        const conversion: GridCell | undefined = this.grid.find((gridCell: GridCell) => {
            return gridCell.position === source.cell.position;
        });

        if (conversion === undefined) {
            throw new DOMException('Impossible conversion from GraphNode to GridCell');
        }

        return conversion;
    }
}
