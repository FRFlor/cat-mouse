<template>
    <div>
        <div id="app">
            <maze-manager></maze-manager>
        </div>
        <div class="credits">
            <div>Credits for the Icons:</div>
            <ul>
                <li>
                    <img src="./assets/mouse.svg" height="20" alt="mouse-icon">: <a
                        href="https://www.flaticon.com/authors/those-icons" title="Those Icons">Those Icons</a> from <a
                        href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a
                        href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0"
                        target="_blank">CC 3.0 BY</a>
                </li>
                <li>
                    <img src="./assets/wall.svg" alt="wall-icon" height="20">: <a
                        href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a>
                    from <a href="https://www.flaticon.com/" itle="Flaticon">www.flaticon.com</a> is licensed by <a
                        href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0"
                        target="_blank">CC 3.0 BY</a>
                </li>
                <li>
                    <img src="./assets/cat.svg" alt="cat-icon" height="20">: <a href="https://www.freepik.com/"
                                                                                title="Freepik">Freepik</a> from <a
                        href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a
                        href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0"
                        target="_blank">CC 3.0 BY</a>
                </li>
                <li>
                    <img src="./assets/milk.svg" alt="cat-icon" height="20">: <a href="https://www.freepik.com/"
                                                                                 title="Freepik">Freepik</a> from <a
                        href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a
                        href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0"
                        target="_blank">CC 3.0 BY</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import MazeManager from './components/MazeManager.vue';

    @Component({components: {MazeManager}})
    export default class App extends Vue {
    }
</script>

<style>
    #app {
        display: flex;
        margin-bottom: 5rem;
    }

    @media only screen and (min-width: 1024px) {
        #app {
            margin: 5rem 5rem;
        }
    }
</style>
