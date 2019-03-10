import GridCell from './GridCell';
import GraphNode from './GraphNode';
// @ts-ignore
import {CellContent} from '../components/MazeGrid.vue';

export default class Graph {
    private nodes: GraphNode[] = [];
    private grid: GridCell[];

    constructor(referenceGrid: GridCell[]) {
        this.grid = referenceGrid;
    }

    private get gridSize(): number {
        return Math.floor(this.grid.length ** 0.5);
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
}
