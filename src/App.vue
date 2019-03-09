<template>
  <div id="app">
    <maze-grid></maze-grid>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MazeGrid from './components/MazeGrid.vue';

@Component({
  components: {
      MazeGrid,
  },
})
export default class App extends Vue {}
</script>

<style>
  #app {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
