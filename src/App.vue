<template>
    <div id="app">
        <v-app id="catmouse">
            <v-layout
                    wrap
                    style="height: 200px;"
            >
                <v-container>
                    <v-layout justify-center>
                        <v-btn
                                color="pink"
                                dark
                                @click.stop="drawer = !drawer"
                        >
                            Toggle
                        </v-btn>
                    </v-layout>
                </v-container>

                <v-navigation-drawer
                        v-model="drawer"
                        absolute
                        temporary
                >
                    <v-list class="pa-1">
                        <v-list-tile avatar>
                            <v-list-tile-avatar>
                                <img src="https://randomuser.me/api/portraits/men/85.jpg">
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title>John Leider</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>

                    <v-list class="pt-0" dense>
                        <v-divider></v-divider>

                        <v-list-tile
                                v-for="item in items"
                                :key="item.title"
                                @click=""
                        >
                            <v-list-tile-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>

                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-navigation-drawer>
            </v-layout>
            <v-navigation-drawer app v-if="false"></v-navigation-drawer>
            <v-toolbar app></v-toolbar>
            <v-content>
                <v-container fluid>
                    <maze-manager></maze-manager>
                </v-container>
                <v-expansion-panel>
                    <v-expansion-panel-content class="orange lighten-4">
                        <template v-slot:header>
                            <v-layout justify-start align-center>
                                <v-icon> list</v-icon>
                                <v-flex class="ml-3">Assets used</v-flex>
                            </v-layout>
                        </template>
                        <v-list>
                            <template v-for="(credit, i) in assetsCredits">
                                <v-list-tile class="orange lighten-5"
                                             :key="i"
                                             avatar>
                                    <v-list-tile-avatar>
                                        <img :src="require(`@/assets/${credit.fileName}`)"
                                             :alt="credit.title">
                                    </v-list-tile-avatar>

                                    <v-list-tile-content>
                                        <v-list-tile-title>
                                            {{credit.authorName}}
                                        </v-list-tile-title>
                                        <v-list-tile-sub-title>
                                            <v-layout>
                                                {{credit.title}}
                                                <v-spacer></v-spacer>
                                                Creative Commons BY 3.0
                                            </v-layout>
                                        </v-list-tile-sub-title>
                                    </v-list-tile-content>

                                    <v-list-tile-action>
                                        <v-btn icon ripple :href="credit.authorPage" target="_blank">
                                            <v-icon color="blue darken-1">link</v-icon>
                                        </v-btn>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-divider></v-divider>
                            </template>
                        </v-list>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-content>
            <app-footer/>
        </v-app>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import MazeManager from './components/MazeManager.vue';
    import AppFooter from '@/components/AppFooter.vue';

    interface ImageCredit {
        title: string;
        fileName: string;
        authorName: string;
        authorPage: string;
    }

    @Component({components: {AppFooter, MazeManager}})
    export default class App extends Vue {
        private assetsCredits: ImageCredit[] = [
            {
                title: 'Mouse Svg',
                fileName: 'mouse.svg',
                authorName: 'Those Icons',
                authorPage: 'https://www.flaticon.com/authors/those-icons',
            },
            {
                title: 'Cat Svg',
                fileName: 'cat.svg',
                authorName: 'Freepik',
                authorPage: 'https://www.freepik.com/',
            },
            {
                title: 'Milk Svg',
                fileName: 'milk.svg',
                authorName: 'Freepik',
                authorPage: 'https://www.freepik.com/',
            },
            {
                title: 'Wall Svg',
                fileName: 'wall.svg',
                authorName: 'Pixel Perfect',
                authorPage: 'https://www.flaticon.com/authors/pixel-perfect',
            },
        ];
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
