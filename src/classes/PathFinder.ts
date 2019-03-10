import Graph from '@/classes/Graph';
import GraphNode from '@/classes/GraphNode';

interface PathNode {
    node: GraphNode;
    distance: number;
    predecessor?: PathNode;
}

const NOT_SET = -1;

export default class PathFinder {
    public static getPath(from: GraphNode, to: GraphNode, graph: Graph): GraphNode[] {
        const path: GraphNode[] = [];

        graph.nodes.forEach((node: GraphNode) => {
            PathFinder.pathNodes.push({
                node,
                distance: NOT_SET,
            });
        });

        const start: PathNode = PathFinder.getPathNode(from);
        const end: PathNode = PathFinder.getPathNode(to);

        start.distance = 0;
        PathFinder.addNeighborsToVisitQueue(start);

        while (PathFinder.visitQueue.length > 0) {
            // @ts-ignore
            const visiting: PathNode = PathFinder.visitQueue.shift();
            PathFinder.addNeighborsToVisitQueue(visiting);
        }

        // Graph has been analyzed and the path is ready to be draw
        let currentPosition: PathNode = end;
        while (currentPosition.predecessor !== undefined) {
            path.push(currentPosition.node);
            currentPosition = currentPosition.predecessor;
        }

        return path.reverse();
    }

    private static visitQueue: PathNode[] = [];
    private static pathNodes: PathNode[] = [];

    private static addNeighborsToVisitQueue(currentPosition: PathNode): void {
        currentPosition.node.neighbors.forEach((neighborGraphNode: GraphNode) => {
            const neighbor: PathNode = PathFinder.getPathNode(neighborGraphNode);
            if (neighbor.distance === NOT_SET) {
                neighbor.distance = currentPosition.distance + 1;
                neighbor.predecessor = currentPosition;
                PathFinder.visitQueue.push(neighbor);
            }
        });
    }

    private static getPathNode(graphNode: GraphNode): PathNode {
        const result: PathNode | undefined = PathFinder.pathNodes.find(
            (pathNode: PathNode) => pathNode.node.cell.position === graphNode.cell.position);

        if (result === undefined) {
            throw new DOMException('Could not find PathNode');
        }

        return result;
    }
}
