<template>
    <div class="maze-cell"
         :class="{'wall' : content === CellContent.Wall}"
         @click="$emit('click')">
        <img v-show="content === CellContent.Milk" src="../assets/milk.svg">
        <img v-show="content === CellContent.Cat" src="../assets/cat.svg">
        <img v-show="content === CellContent.Mouse" src="../assets/mouse.svg">
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
            max-width: 65%;
            height: auto;
        }

        &:hover {
            cursor: pointer;
        }
    }
</style>
