<template>
    <div class="maze-manager">
        <div class="hud">
            <div class="configurations">
                <div>
                    <div>
                        <button>Load</button>
                        <button>Export</button>
                    </div>
                    <button id="get-example">Get Example</button>
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

            <div class="elements-selector">
                <div>Select an element to place:</div>
                <div class="options">
                    <img :class="{'selected' : elementSelected === CellContent.Wall}"
                         @click="elementSelected = CellContent.Wall"
                         id="wall-select"
                         src="../assets/wall.svg" height="50" alt="wall-select">
                    <img :class="{'selected' : elementSelected === CellContent.Mouse}"
                         @click="elementSelected = CellContent.Mouse"
                         id="mouse-select"
                         src="../assets/mouse.svg" height="50" alt="mouse-select">
                    <img :class="{'selected' : elementSelected === CellContent.Cat}"
                         @click="elementSelected = CellContent.Cat"
                         id="cat-select"
                         src="../assets/cat.svg" height="50" alt="cat-select">
                    <img :class="{'selected' : elementSelected === CellContent.Milk}"
                         @click="elementSelected = CellContent.Milk"
                         id="milk-select"
                         src="../assets/milk.svg" height="50" alt="milk-select">
                </div>
            </div>
        </div>
        <maze-grid :grid-size="gridSize"
                   :action-request="newAction"
                   @cell-clicked="onCellClicked"/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import MazeGrid, {CellContent, CellData, EMPTY_ACTION, MazeGridAction} from './MazeGrid.vue';

    @Component({components: {MazeGrid}})
    export default class MazeManager extends Vue {
        private CellContent = CellContent;
        private gridSize: number = 10;
        private newAction: MazeGridAction = EMPTY_ACTION;
        private actionsCount: number = 0;
        private elementSelected: CellContent = CellContent.Wall;

        private onCellClicked(currentState: CellData) {
            this.changeCellContent(currentState.position, this.elementSelected);
        }

        private changeCellContent(position: number, content: CellContent) {
            this.newAction.cellData = {position, content};
            Vue.set(this.newAction, 'id', ++this.actionsCount);
        }
    }
</script>

<style scoped lang="scss">
    #get-example {
        width: 100%;
    }

    .maze-manager {
        width: 18rem;
        font-size: 0.85rem;
        .configurations {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            .grid-size-label {
                padding-right: 1rem;
            }
        }

        .elements-selector {
            > div {
                margin-bottom: 1rem;
                font-size: 1rem;
            }
            .options {
                img {
                    &:hover {
                        cursor: pointer;
                    }
                    &.selected {
                        border: #7ec4ff 5px solid;
                    }
                }
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            margin-bottom: 1rem;
        }
    }
</style>
