<template>
    <div class="maze-grid"
         :style="`grid-template-columns: repeat(${this.columnCount}, auto)`">
        <maze-cell v-for="(cell, position) in cells"
                   :key="position"
                   :cell-data="cell"
                   @click="onCellClicked(cell)"
                   class="maze-cell">
        </maze-cell>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import MazeCell, {CellContent} from './MazeCell.vue';
    import GridCell from '../classes/GridCell';

    export {CellContent};

    export enum MazeGridActionType {
        ContentChange,
        ToggleRotation,
    }

    export interface MazeGridAction {
        id: number;
        targetPosition: number;
        type: MazeGridActionType;
        newContent?: CellContent;
    }

    export const EMPTY_ACTION: MazeGridAction = {
        id: -1,
        targetPosition: -1,
        type: MazeGridActionType.ContentChange,
        newContent: CellContent.Nothing,
    };

    @Component({components: {MazeCell}})
    export default class MazeGrid extends Vue {
        @Prop({default: 6}) private gridSize!: number;
        @Prop({default: () => EMPTY_ACTION}) private actionRequest!: MazeGridAction;

        // Properties
        private cells: GridCell[] = [];

        private get columnCount(): number {
            return this.gridSize;
        }

        // Watchers
        @Watch('actionRequest.id')
        public onNewActionRequested(): void {
            switch (this.actionRequest.type) {
                case MazeGridActionType.ContentChange:
                    return this.changeCellContent();
                case MazeGridActionType.ToggleRotation:
                    return this.toggleRotationOnCell();
                default:
                    return;
            }
        }

        private changeCellContent(): void {
            const newContent: CellContent | undefined = this.actionRequest.newContent;

            if (newContent === undefined) {
                throw new DOMException('Cell content cannot be changed to undefined');
            }

            if (this.actionRequest.newContent === CellContent.Cat) {
                this.removeAll(CellContent.Cat);
            }

            if (this.actionRequest.newContent === CellContent.Mouse) {
                this.removeAll(CellContent.Mouse);
            }

            this.cells[this.actionRequest.targetPosition].content = newContent;
        }

        private toggleRotationOnCell(): void {
            this.cells[this.actionRequest.targetPosition].isSpinning =
                !this.cells[this.actionRequest.targetPosition].isSpinning;
        }

        @Watch('gridSize')
        private populateGridWithEmptyCells(): void {
            this.cells = 'x'.repeat(this.gridSize ** 2).split('')
                .map((_: any, position: number) => new GridCell(position));
            GridCell.gridSize = this.gridSize;

            this.$emit('grid-state-changed', this.cells);
        }

        // Event Handlers
        private created(): void {
            this.populateGridWithEmptyCells();
        }

        private onCellClicked(cell: GridCell): void {
            this.$emit('cell-clicked', cell);
        }

        private removeAll(contentToDelete: CellContent): void {
            this.cells.forEach((cell: GridCell) => {
                if (cell.content === contentToDelete) {
                    cell.content = CellContent.Nothing;
                }
            });
        }
    }
</script>

<style scoped lang="scss">
    .maze-grid {
        display: grid;
    }
</style>
