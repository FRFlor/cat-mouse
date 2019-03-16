<template>
    <div class="maze-manager">
        <v-dialog
                v-model="showRulesModal"
                max-width="420"
        >
            <v-card class="blue lighten-5">
                <v-card-title
                        class="headline blue darken-1 white--text"
                        primary-title
                >
                    Instructions
                </v-card-title>
                <v-card-text>
                    Use the vertical toolbar to build your maze and place the cat/mouse/milk anywhere in your maze.
                </v-card-text>
                <v-card-text>
                    There must be at least one cat and one mouse for the simulation to start.
                    The cat will get all the milk boxes and the mouse with the least amount of movements possible.
                </v-card-text>
                <v-card-text>
                    Note: The cat will try its best to eat the mouse last.
                </v-card-text>
                <v-divider></v-divider>

                <v-btn class="ma-0 blue darken-1 white--text"
                       @click="showRulesModal = false"
                       block>Got it!</v-btn>
            </v-card>
        </v-dialog>

        <v-layout class="top-toolbar mb-2" row wrap align-end>
            <v-btn class="help-button ma-0 blue--text"
                   @click="showRulesModal = true"
                   icon>
                <v-icon>fas fa-question-circle</v-icon></v-btn>
            <div>
                <v-tooltip top>
                    <v-btn id="decrease-maze-size"
                           class="ma-0 ml-2"
                           outline color="red lighten-2"
                           :disabled="gridSize <= 7"
                           slot="activator"
                           @click="gridSize--">
                        <v-layout align-center justify-center pt-2>
                            <v-icon size="14px">fas fa-th-large</v-icon>
                            <v-icon class="pl-1 pb-3" size="12px">fas fa-minus-circle</v-icon>
                        </v-layout>
                    </v-btn>
                    <span>Decrease maze size</span>
                </v-tooltip>

                <v-tooltip top>
                    <v-btn id="increase-maze-size"
                           class="ma-0"
                           slot="activator"
                           outline color="teal lighten-2"
                           @click="gridSize++">
                        <v-layout align-center justify-center pt-2>
                            <v-icon size="14px">fas fa-th</v-icon>
                            <v-icon class="pl-1 pb-3" size="12px">fas fa-plus-circle</v-icon>
                        </v-layout>
                    </v-btn>
                    <span>Increase maze size</span>
                </v-tooltip>
            </div>
            <div>
                <v-tooltip top>
                    <v-btn id="random-maze"
                           class="mr-0 my-0"
                           slot="activator"
                           disabled
                           outline color=""
                           @click="">
                        <v-icon size="14px">fas fa-dice</v-icon>
                    </v-btn>
                    <span>Generate random maze</span>
                </v-tooltip>

                <v-tooltip top>
                    <v-btn @click="onPlayStopClicked"
                           :disabled="! canStartGame"
                           class="ma-0"
                           slot="activator"
                           id="play-stop"
                           outline :color="isGameRunning ? 'red' : 'green'">
                        <v-icon>{{isGameRunning ? 'fas fa-stop' : 'fas fa-play'}}</v-icon>
                    </v-btn>
                    <span>{{(catCell || mouseCell) === undefined ? 'A cat and a mouse must be placed in the maze' : 'Play!'}}</span>
                </v-tooltip>
            </div>
        </v-layout>
        <div class="maze-grid-container pr-2 pb-2">
            <v-btn-toggle v-model="elementSelectedIndex" class="element-selector mr-2" mandatory>
                <v-btn large v-for="(element, i) in ['wall', 'cat', 'mouse', 'milk']"
                       :id="`${element}-select`"
                       :key="i"
                       class="element-button">
                    <img :src="require(`@/assets/${element}.svg`)"
                         :alt="`${element}-select`"
                         height="35">
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn large class="element-button">
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
        private showRulesModal: boolean = false;

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
    }

    #random-maze {
        margin-left: 63px;
    }

    .element-button {
        width: 55px;
        height: 55px;
    }

    .top-toolbar {
        max-width: 420px;
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

    .help-button {
        width: 55px;
    }

    @media screen and (min-width: 768px) {
        #random-maze {
            margin-left: 0;
        }
    }
</style>
