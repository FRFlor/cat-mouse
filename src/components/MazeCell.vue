<template>
    <div class="maze-cell"
         :class="{'wall' : content === CellContent.Wall}"
         @click="$emit('click')">
        <img v-if="content === CellContent.Milk" src="../assets/milk.svg" class="milk-cell-image" :class="{'rotate': isSpinning}">
        <img v-if="content === CellContent.Cat" src="../assets/cat.svg" class="cat-cell-image" :class="{'rotate': isSpinning}">
        <img v-if="content === CellContent.Mouse" src="../assets/mouse.svg" class="mouse-cell-image" :class="{'rotate': isSpinning}">
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import GridCell from '../classes/GridCell';

    export enum CellContent {
        Nothing = 'Space',
        Wall = 'Wall',
        Cat = 'Cat',
        Mouse = 'Mouse',
        Milk = 'Milk',
    }

    @Component
    export default class MazeCell extends Vue {
        @Prop() private cellData!: GridCell;

        private CellContent = CellContent;

        private get content(): CellContent {
            return this.cellData.content;
        }

        private get isSpinning(): boolean {
            return this.cellData.isSpinning;
        }
    }
</script>

<style scoped lang="scss">
    .rotate {
        animation: rotation 2s infinite linear;
    }

    @keyframes rotation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(359deg);
        }
    }

    .maze-cell {
        background: #aac6ff;
        border: rgba(103, 123, 166, 0.10) 1px solid;
        height: 40px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        &.wall {
            background-image: url("../assets/wall.svg");
        }

        img {
            max-width: 85%;
            height: auto;
        }

        &:hover {
            cursor: pointer;
        }
    }
</style>
