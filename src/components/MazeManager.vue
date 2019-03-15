<template>
    <div class="maze-manager">
        <div class="hud mb-3">
            <div class="configurations">
                <div>
                    <div>
                        <button>Load</button>
                        <button @click="onExportClicked">Export</button>
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
                            :disabled="! canStartGame"
                            id="play-stop"
                            v-text="gameLoopInterval ? 'Stop' : 'Play'">Play
                    </button>
                </div>
            </div>

        </div>
        <div class="maze-grid-container pa-2">
            <v-btn-toggle v-model="elementSelectedIndex" class="element-selector mr-2" mandatory>
                <v-btn large v-for="element in ['wall', 'cat', 'mouse', 'milk']"
                       :id="`${element}-select`"
                       class="element-button grey lighten-2">
                    <img :src="require(`@/assets/${element}.svg`)"
                         :alt="`${element}-select`"
                         height="35">
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn large class="element-button grey lighten-2">
                    <v-layout column align-center justify-center>
                        <v-icon class="red--text text--darken-3">fas fa-trash-alt</v-icon>
                    </v-layout>
                </v-btn>
            </v-btn-toggle>
            <maze-grid :cells="grid"
                       @grid-state-changed="(newState) => grid = newState"
                       @cell-clicked="onCellClicked"/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import MazeGrid, {CellContent} from './MazeGrid.vue';
    import Cat from '../classes/Cat';
    import GridCell from '../classes/GridCell';
    // @ts-ignore
    import {save} from 'save-file';

    @Component({components: {MazeGrid}})
    export default class MazeManager extends Vue {
        private CellContent = CellContent;

        private elementToSelect: CellContent[] = [
            CellContent.Wall,
            CellContent.Cat,
            CellContent.Mouse,
            CellContent.Milk,
            CellContent.Nothing,
        ];
        private elementSelectedIndex: number = 4;

        private gridSize: number = 10;
        private grid: GridCell[] = [];
        private cat: Cat | null = null;
        private gameLoopInterval: any = null;

        private get elementSelected(): CellContent {
            return this.elementToSelect[this.elementSelectedIndex];
        }

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

            if (this.isGameRunning) {
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

        private async onExportClicked(): Promise<void> {
            await save(JSON.stringify(this.grid), 'example.txt');
        }

        private restartCat(): void {
            if (!this.catCell || !this.mouseCell || !this.gameLoopInterval) {
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

            // Do not let user erase cat or mouse
            if (this.isGameRunning &&
                (cell.content === CellContent.Cat || cell.content === CellContent.Mouse)) {
                return;
            }

            cell.content = this.elementSelected;
            this.restartCat();
        }

        private endGameLoop(): void {
            if (!this.isGameRunning) {
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

        private get canStartGame(): boolean {
            return !this.isGameRunning && (!!this.mouseCell && !!this.catCell);
        }

        private get isGameRunning(): boolean {
            return !!this.gameLoopInterval;
        }
    }
</script>

<style scoped lang="scss">
    .element-selector {
        max-height: 320px;
        flex-direction: column;
        align-items: center;
        .element-button {
            width: 55px;
            height: 55px;
        }

    }

    .hud {
        max-width: 30rem;
    }

    .maze-grid-container {
        overflow-x: auto;
        display: flex;
    }

    .maze-manager {
        min-width: 18rem;
        font-size: 0.85rem;

        .configurations {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;

            .grid-size-label {
                padding-right: 1rem;
            }
        }
    }
</style>
