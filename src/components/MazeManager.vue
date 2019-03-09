<template>
    <div class="maze-manager">
        <div class="configurations">
            <button>Load Preset</button>

            <div>
                <span class="grid-size-label">Grid Size</span>
                <button id="decrease-maze-size"
                        :disabled="gridSize <= 7"
                        @click="gridSize--">-</button>
                <button id="increase-maze-size"
                        @click="gridSize++">+</button>
            </div>

            <button>Play</button>
        </div>

        <maze-grid :grid-size="gridSize"/>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {CellContent} from './MazeCell.vue';
    import MazeGrid from './MazeGrid.vue';

    @Component({components: {MazeGrid}})
    export default class MazeManager extends Vue {
        private gridSize: number = 10;
    }
</script>

<style scoped lang="scss">
    .maze-manager {
        .configurations {
            display: flex;
            justify-content: space-between;
            width: 18rem;
            margin-bottom: 1rem;
            font-size: 0.85rem;
            .grid-size-label {
                padding-right: 1rem;
            }
        }
    }
</style>
