<template>
    <v-footer class="grey darken-3"
              inset dark app>
        <v-spacer></v-spacer>
        <v-btn class="grey darken-3 mr-5 elevation-0"
               href="https://www.felipeflor.com"
               target="_blank"
               round >Felipe Flor</v-btn>
        <v-btn v-for="link in links"
               :key="link.icon"
               :href="link.destination"
               target="_blank"
               class="white--text"
               icon>
            <v-icon size="24px">{{ link.icon }}</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
    </v-footer>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    interface Link {
        icon: string;
        destination: string;
    }

    @Component
    export default class AppFooter extends Vue {
        private links: Link[] = [
            {
                icon: 'fab fa-linkedin',
                destination: 'https://www.linkedin.com/in/felipe-flor/',
            },
            {
                icon: 'fab fa-github',
                destination: 'https://github.com/FRFlor/cat-mouse',
            },
            {
                icon: 'fas fa-user-circle',
                destination: 'https://www.felipeflor.com',
            },
        ];
    }
</script>

<style lang="scss" scoped>
    .expander-section {
        max-width: 450px;
    }
</style>
