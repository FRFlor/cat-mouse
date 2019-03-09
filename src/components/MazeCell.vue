<template>
    <div class="maze-cell" v-text="content">
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    export enum CellContent {
        Nothing = '',
        Wall = 'W',
        Cat = 'C',
        Mouse = 'M',
        Cheese = 'ch',
    }

    @Component
    export default class MazeCell extends Vue {
        @Prop({default: () => CellContent.Nothing}) public content!: CellContent;
    }
</script>

<style scoped lang="scss">
    .maze-cell {
        background: blue;
        border: orange 2px solid;
        height: 40px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
