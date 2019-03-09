<template>
    <div class="maze-grid"
         :style="`grid-template-columns: repeat(${this.columnCount}, auto)`">
        <maze-cell v-for="(content, position) in cellsContent"
                   :key="position"
                   :content="content"
                   @click="onCellClicked({content, position})"
                   class="maze-cell">
        </maze-cell>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import MazeCell, {CellContent} from './MazeCell.vue';

    export {CellContent};

    export interface CellData {
        content: CellContent;
        position: number;
    }

    export interface MazeGridAction {
        id: number;
        cellData: CellData;
    }

    export const EMPTY_ACTION: MazeGridAction = {
        id: -1,
        cellData: {
            content: CellContent.Nothing,
            position: -1,
        },
    };

    @Component({components: {MazeCell}})
    export default class MazeGrid extends Vue {
        @Prop({default: 6}) private gridSize!: number;
        @Prop({default: () => EMPTY_ACTION}) private actionRequest!: MazeGridAction;

        // Properties
        private cellsContent: CellContent[] = [];

        private get columnCount(): number {
            return this.gridSize;
        }

        // Watchers
        @Watch('actionRequest.id')
        public changeCellContent(): void {
            if (this.actionRequest.cellData.content === CellContent.Cat) {
                this.removeAll(CellContent.Cat);
            }

            if (this.actionRequest.cellData.content === CellContent.Mouse) {
                this.removeAll(CellContent.Mouse);
            }

            Vue.set(
                this.cellsContent,
                this.actionRequest.cellData.position,
                this.actionRequest.cellData.content,
            );
        }

        @Watch('gridSize')
        private populateGridWithEmptyCells(): void {
            this.cellsContent = 'x'.repeat(this.gridSize ** 2).split('').map(() => CellContent.Nothing);
        }

        @Watch('cellsContent')
        private notifyOfGridChange(): void {
            this.$emit('grid-state-changed', this.cellsContent);
        }

        // Event Handlers
        private created(): void {
            this.populateGridWithEmptyCells();
        }

        private onCellClicked(currentState: CellData): void {
            this.$emit('cell-clicked', currentState);
        }

        private removeAll(target: CellContent): void {
            this.cellsContent.forEach((cellContent: CellContent, index: number) => {
                if (cellContent === target) {
                    this.cellsContent[index] = CellContent.Nothing;
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
