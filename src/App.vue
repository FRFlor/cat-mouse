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
