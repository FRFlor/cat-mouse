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
                    <button @click="onPlayStopClicked"
                            v-text="gameLoopInterval ? 'Stop' : 'Play'">Play
                    </button>
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
                    <div :class="{'selected' : elementSelected === CellContent.Nothing}"
                         @click="elementSelected = CellContent.Nothing"
                         id="nothing-select">
                    </div>
                </div>
            </div>
        </div>
        <maze-grid :cells="grid"
                   @grid-state-changed="(newState) => grid = newState"
                   @cell-clicked="onCellClicked"/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import MazeGrid, {CellContent} from './MazeGrid.vue';
    import Cat from '../classes/Cat';
    import GridCell from '../classes/GridCell';

    @Component({components: {MazeGrid}})
    export default class MazeManager extends Vue {
        private CellContent = CellContent;

        private gridSize: number = 10;
        private elementSelected: CellContent = CellContent.Wall;
        private grid: GridCell[] = [];
        private cat: Cat | null = null;
        private gameLoopInterval: any = null;

        private created(): void {
            this.populateGridWithEmptyCells();
        }

        private removeAll(contentToDelete: CellContent): void {
            this.grid.forEach((cell: GridCell) => {
                if (cell.content === contentToDelete) {
                    cell.content = CellContent.Nothing;
                }
            });
        }

        @Watch('gridSize')
        private populateGridWithEmptyCells(): void {
            this.grid = 'x'.repeat(this.gridSize ** 2).split('')
                .map((_: any, position: number) => new GridCell(position));
            GridCell.gridSize = this.gridSize;
        }

        private onPlayStopClicked(): void {
            this.stopSpinningAnimations();

            if (this.gameLoopInterval) {
                this.endGameLoop();
            } else {
                if (this.catCell === undefined) {
                    return;
                }
                this.gameLoopInterval = setInterval(() => {
                    this.gameLoop();
                }, 350);

                this.restartCat();
            }
        }

        private restartCat(): void {
            if (! this.catCell || !this.mouseCell || !this.gameLoopInterval) {
                console.log('ignoed');
                return;
            }
            this.cat = new Cat(this.catCell, this.grid);
            this.cat.start();
        }

        private onCellClicked(cell: GridCell): void {
            this.stopSpinningAnimations();

            if (this.elementSelected === CellContent.Cat) {
                this.removeAll(CellContent.Cat);
            }

            if (this.elementSelected === CellContent.Mouse) {
                this.removeAll(CellContent.Mouse);
            }

            cell.content = this.elementSelected;
            this.restartCat();
        }

        private endGameLoop(): void {
            if (this.gameLoopInterval === null) {
                return;
            }

            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;

            if (this.catCell === undefined) {
                return;
            }

            const isMouseAlive: boolean = this.mouseCell !== undefined;

            // @ts-ignore
            isMouseAlive ? (this.mouseCell.isSpinning = true) : (this.catCell.isSpinning = true);
        }

        private gameLoop(): void {
            if (this.cat === null) {
                return;
            }

            if (!this.cat.move()) {
                this.endGameLoop();
            }
        }

        private stopSpinningAnimations(): void {
            this.grid.forEach((cell: GridCell) => cell.isSpinning = false);
        }

        private get catCell(): GridCell | undefined {
            return this.grid.find((cell: GridCell) => cell.content === CellContent.Cat);
        }

        private get mouseCell(): GridCell | undefined {
            return this.grid.find((cell: GridCell) => cell.content === CellContent.Mouse);
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
                img, #nothing-select {
                    &:hover {
                        cursor: pointer;
                    }
                    &.selected {
                        border: #7ec4ff 5px solid;
                    }
                }
                #nothing-select {
                    height: 50px;
                    width: 50px;
                    background: #aac6ff;
                }
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            margin-bottom: 1rem;
        }
    }
</style>
