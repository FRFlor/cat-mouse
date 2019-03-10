import GridCell from './GridCell';
import Graph from './Graph';

export default class Cat {
    private grid: GridCell[];
    private position: number;
    private graph: Graph;

    constructor(startPosition: number, grid: GridCell[]) {
        this.grid = grid;
        this.position = startPosition;
        this.graph = new Graph(this.grid);
    }

    public getNewPosition(): number {
        return ++this.position;
    }

    public composeGraph() {
        this.graph.compose();
    }
}
