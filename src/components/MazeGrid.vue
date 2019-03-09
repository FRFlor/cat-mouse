<template>
    <div class="maze-grid">
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class MazeGrid extends Vue {
    }
</script>

<style scoped lang="scss">
    .maze-grid {
        background: red;
        height: 150px;
        width: 150px;
    }
</style>
