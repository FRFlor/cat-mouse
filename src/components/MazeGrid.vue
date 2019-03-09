<template>
    <div class="maze-grid"
         :style="`grid-template-columns: repeat(${this.columnCount}, auto)`">
        <div v-for="(cell, index) in cells"
             :key="index"
             class="maze-cell">

        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class MazeGrid extends Vue {
        private cells: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

        private get columnCount(): number {
            return Math.floor(this.cells.length ** 0.5);
        }
    }
</script>

<style scoped lang="scss">
    .maze-grid {
        display: grid;
        .maze-cell {
            background: blue;
            border: orange 2px solid;
            height: 20px;
            width: 20px;
        }
    }
</style>
