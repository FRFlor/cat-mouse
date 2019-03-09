// @ts-ignore
import {CellContent} from '../components/MazeGrid.vue';

export default class Cat {
    private grid: CellContent[];
    private position: number;

    constructor(startPosition: number, grid: CellContent[]) {
        this.grid = grid;
        this.position = startPosition;
    }

    public getNewPosition(): number {
        return ++this.position;
    }
}
