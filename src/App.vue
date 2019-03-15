<template>
    <div id="app">
        <v-app id="catmouse">
            <v-toolbar dark class="blue darken-2" dense>
                <v-toolbar-title>Cat & Mouse!</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click.stop="drawer = ! drawer" flat>List of Assets</v-btn>
            </v-toolbar>

            <v-navigation-drawer class="assets-list"
                                 v-model="drawer"
                                 temporary app>
                <assets-list/>
            </v-navigation-drawer>

            <v-content>
                <v-container fluid>
                    <maze-manager></maze-manager>
                </v-container>
            </v-content>

            <app-footer/>
        </v-app>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import MazeManager from './components/MazeManager.vue';
    import AppFooter from '@/components/AppFooter.vue';
    import AssetsList from '@/components/AssetsList.vue';

    @Component({components: {AssetsList, AppFooter, MazeManager}})
    export default class App extends Vue {
        private drawer: boolean = false;
    }
</script>
