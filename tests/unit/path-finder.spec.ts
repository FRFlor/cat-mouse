import {expect} from 'chai';
import PathFinder from '@/classes/PathFinder';
import Graph from '@/classes/Graph';
import GridCell from '@/classes/GridCell';
import GraphNode from '@/classes/GraphNode';
import Vue from 'vue';
import Vuetify from 'vuetify';
// @ts-ignore
import {CellContent} from '@/components/MazeCell';

Vue.use(Vuetify);

describe('PathFinder', () => {
    it('Calculates the shortest path between to vertices of a graph', () => {
        const pos = (row: number, column: number) => column + row * 3;
        GridCell.gridSize = 3;

        // Make an empty 3x3 grid
        const grid: GridCell[] = 'x'.repeat(9).split('').map((_: any, position: number) =>
            new GridCell(position, CellContent.Nothing));

        // Place a wall at row = 0, col = 1
        grid[pos(0, 1)].content = CellContent.Wall;

        // Compose Graph
        const graph: Graph = new Graph(grid);
        graph.compose();

        const start = graph.toGraphNode(grid[pos(0, 0)]);
        const end = graph.toGraphNode(grid[pos(0, 2)]);

        // Request path from row = 0, col = 0. To row=0, col=2
        const receivedPath: number[] = PathFinder
            .getPath(start, end, graph)
            .map((graphNode: GraphNode) => graphNode.cell.position);

        const expectedPath: number[] = [
            pos(1, 0),
            pos(1, 1),
            pos(1, 2),
            pos(0, 2),
        ];

        expectedPath.forEach((expectedPosition: number, index: number) => {
            const receivedPosition: number = receivedPath[index];
            expect(receivedPosition).to.equals(expectedPosition);
        });
    });
});
