<template>
    <v-dialog :value="renderModal"
              max-width="420">
        <v-layout class="white pa-3 pt-4" column align-center justify-center>
            <v-flex class="title mb-3">Calculating Path</v-flex>
            <v-progress-linear ref="progress" :value="progress"></v-progress-linear>
        </v-layout>
    </v-dialog>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

    // At least 1000ms have to pass after the request for the modal to appear
    const TIME_UNTIL_SHOWING_MODAL_MS: number = 500;

    @Component
    export default class LoadingModal extends Vue {
        @Prop() private showModal!: boolean;  // Parent requesting the modal to appear
        @Prop() private progress!: number;  // Loading progress value

        private renderModal: boolean = false;
        private timeOfRequestToShow: number = 0;

        @Watch('showModal')
        private onShowModalChanged(isRequestingModal: boolean) {
            if (isRequestingModal) {
                this.timeOfRequestToShow = new Date().getTime();
            } else {
                this.timeOfRequestToShow = 0;
                this.renderModal = false;
            }
        }

        @Watch('progress')
        private onProgressChanged() {
            if (this.timeOfRequestToShow === 0) {
                return;
            }
            if (new Date().getTime() - this.timeOfRequestToShow > TIME_UNTIL_SHOWING_MODAL_MS) {
                this.renderModal = true;
            }
        }
    }
</script>
