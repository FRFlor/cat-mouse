<template>
    <div class="maze-cell"
         :class="{'wall' : content === CellContent.Wall}"
         @click="$emit('click')">
        <img v-if="content === CellContent.Milk" src="../assets/milk.svg" class="milk-cell-image">
        <img v-if="content === CellContent.Cat" src="../assets/cat.svg" class="cat-cell-image">
        <img v-if="content === CellContent.Mouse" src="../assets/mouse.svg" class="mouse-cell-image">
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    export enum CellContent {
        Nothing,
        Wall,
        Cat,
        Mouse,
        Milk,
    }

    @Component
    export default class MazeCell extends Vue {
        @Prop({default: () => CellContent.Nothing}) public content!: CellContent;

        private CellContent = CellContent;
    }
</script>

<style scoped lang="scss">
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
