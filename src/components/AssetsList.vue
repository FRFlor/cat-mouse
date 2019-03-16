<template>
    <div>
        <v-layout justify-center class="pb-2 pt-3 title">Assets</v-layout>
        <v-list two-line>
            <v-divider></v-divider>
            <div v-for="(credit, i) in assetsCredits"
                 :index="i">
                <v-list-tile :href="require(`@/assets/${credit.fileName}`)"
                             target="_blank">
                    <v-list-tile-avatar class="my-auto" tile> <!--Note: 'tile' makes avatar box square -->
                        <img :src="require(`@/assets/${credit.fileName}`)"
                             :alt="credit.title">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title>
                            by {{credit.authorName}}
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                            {{credit.title}} (CC BY 3.0)
                        </v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                        <v-btn icon ripple :href="credit.authorPage" target="_blank">
                            <v-icon color="blue darken-1">link</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
                <v-divider></v-divider>
            </div>
        </v-list>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    interface ImageCredit {
        title: string;
        fileName: string;
        authorName: string;
        authorPage: string;
    }

    @Component
    export default class AssetsDrawer extends Vue {
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
