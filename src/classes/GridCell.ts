// @ts-ignore
import {CellContent} from '../components/MazeGrid.vue';

interface Coordinates {
    row: number;
    column: number;
}

export default class GridCell {
    public static gridSize: number = 1;
    public content: CellContent;
    public position: number;

    public get coordinates(): Coordinates {
        const row: number = Math.floor(this.position / GridCell.gridSize);
        const column: number = this.position - GridCell.gridSize * row;

        return {row, column};
    }

    constructor(position: number, content: CellContent = CellContent.Nothing) {
        this.position = position;
        this.content = content;
    }
}
