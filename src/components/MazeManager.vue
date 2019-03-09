import {CellContent} from './MazeCell';
<template>
    <div class="maze-manager">
        <div class="configurations">
            <div>
                <div>
                    <button>Load</button>
                    <button>Export</button>
                </div>
                <button>Get Example</button>
            </div>
            <div>
                <span class="grid-size-label">Grid Size</span>
                <button id="decrease-maze-size"
                        :disabled="gridSize <= 7"
                        @click="gridSize--">-
                </button>
                <button id="increase-maze-size"
                        @click="gridSize++">+
                </button>
            </div>

            <div>
                <button>Play</button>
            </div>
        </div>

        <maze-grid :grid-size="gridSize"
                   :action-request="newAction"
                   @cell-clicked="onCellClicked"/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import MazeGrid, {CellContent, MazeGridAction, CellData, EMPTY_ACTION} from './MazeGrid.vue';

    @Component({components: {MazeGrid}})
    export default class MazeManager extends Vue {
        private gridSize: number = 10;
        private newAction: MazeGridAction = EMPTY_ACTION;
        private actionsCount: number = 0;

        private onCellClicked(currentState: CellData) {
            if (currentState.content === CellContent.Nothing) {
                this.changeCellContent(currentState.position, CellContent.Wall);
            }
        }

        private changeCellContent(position: number, content: CellContent) {
            this.newAction.cellData = {position, content};
            Vue.set(this.newAction, 'id', ++this.actionsCount);
        }
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
