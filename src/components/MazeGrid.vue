<template>
    <div class="maze-grid"
         :style="`grid-template-columns: repeat(${this.columnCount}, 40px)`">
        <maze-cell v-for="(cell, position) in cells"
                   :key="position"
                   :cell-data="cell"
                   @click="onCellClicked(cell)">
        </maze-cell>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import MazeCell, {CellContent} from './MazeCell.vue';
    import GridCell from '../classes/GridCell';

    export {CellContent};

    @Component({components: {MazeCell}})
    export default class MazeGrid extends Vue {
        @Prop({default: []}) private cells!: GridCell[];

        private onCellClicked(cell: GridCell): void {
            this.$emit('cell-clicked', cell);
        }

        private get columnCount(): number {
            return Math.floor(this.cells.length ** 0.5);
        }
    }
</script>

<style scoped lang="scss">
    .maze-grid {
        display: grid;
        grid-column-gap: 0;
        grid-row-gap: 0;
    }
</style>
