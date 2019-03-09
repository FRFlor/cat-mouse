<template>
    <div class="maze-grid"
         :style="`grid-template-columns: repeat(${this.columnCount}, auto)`">
        <maze-cell v-for="(content, index) in cellsContent"
                   :key="index"
                   :content="content"
                   class="maze-cell">

        </maze-cell>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import MazeCell, {CellContent} from './MazeCell.vue';

    @Component({components: {MazeCell}})
    export default class MazeGrid extends Vue {
        @Prop({default: 5}) public gridSize!: number;

        private cellsContent: CellContent[] = [];

        private created(): void {
            this.populateGridWithEmptyCells();
        }

        private populateGridWithEmptyCells(): void {
            this.cellsContent = 'x'.repeat(this.gridSize ** 2).split('').map(() => CellContent.Nothing);
        }

        private get columnCount(): number {
            return this.gridSize;
        }
    }
</script>

<style scoped lang="scss">
    .maze-grid {
        display: grid;
    }
</style>
