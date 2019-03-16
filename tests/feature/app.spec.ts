import {expect} from 'chai';
import Vue from 'vue';
import {mount, Wrapper} from '@vue/test-utils';
import MazeManager from '@/components/MazeManager.vue';
import Vuetify from 'vuetify';

// @ts-ignore
import * as sinon from 'sinon';

describe('Cat and Mouse', () => {
    let wrapper: Wrapper<MazeManager>;
    let clock: any;
    Vue.use(Vuetify); // Source: https://github.com/vuetifyjs/vuetify/issues/5096#issuecomment-423300001

    const currentGridSize = (): number => Math.floor(wrapper.findAll('.maze-cell').length ** 0.5);
    const placeElementAt = (elementName: string, row: number, column: number) => {
        const position: number = column + row * currentGridSize();

        wrapper.find(`#${elementName}-select`).trigger('click');
        wrapper.findAll('.maze-cell').at(position).trigger('click');
    };
    const expectElementAt = (elementName: string, row: number, column: number) => {
        const position: number = column + row * currentGridSize();

        expect(wrapper.findAll('.maze-cell').at(position)
            .find(`.${elementName}-cell-image`).exists()).to.equal(true);
    };

    const tickOneTurn = () => {
        clock.tick(350);
    };

    beforeEach(() => {
        clock = sinon.useFakeTimers();
        wrapper = mount(MazeManager);
    });

    afterEach(() => {
        clock.restore();
    });

    // ** Cue X-File theme **
    // The first test in the suite that involves the component fails...
    // No one knows why... Some say this spot is haunted...
    it('----', () => {
        expect(true).to.equal(true);
    });

    it('Moves the cat towards the mouse when play is pressed', () => {
        placeElementAt('cat', 0, 0);
        placeElementAt('mouse', 0, 5);

        wrapper.find('#play-stop').trigger('click');

        [1, 2, 3, 4].forEach((turn: number) => {
            tickOneTurn();
            expectElementAt('mouse', 0, 5);
            expectElementAt('cat', 0, turn);
        });

        tickOneTurn();
        expectElementAt('cat', 0, 5);
        expect(wrapper.findAll('.mouse-cell-image').length).to.equal(0);
    });

    it('Causes the cat to respect the existence of walls', () => {
        placeElementAt('cat', 0, 0);

        // A wall is now placed between the cat and the mouse
        placeElementAt('wall', 0, 4);
        placeElementAt('wall', 1, 4);
        placeElementAt('wall', 2, 4);

        placeElementAt('mouse', 0, 5);

        wrapper.find('#play-stop').trigger('click');

        // For the first 3 turns, it's expected that the cat will walk towards the right
        [1, 2, 3].forEach((column: number) => {
            tickOneTurn();
            expectElementAt('cat', 0, column);
        });

        // At this point, there's a wall immediately to the right of the cat.
        // The cat will need to move down to bypass the wall
        [1, 2, 3].forEach((row: number) => {
            tickOneTurn();
            expectElementAt('cat', row, 3);
        });

        // The cat can now move right to go around the wall
        [4, 5].forEach((column: number) => {
            tickOneTurn();
            expectElementAt('cat', 3, column);
        });

        // The cat can now go straight up towards the mouse
        [2, 1].forEach((row: number) => {
            tickOneTurn();
            expectElementAt('cat', row, 5);
        });

        tickOneTurn();
        expectElementAt('cat', 0, 5);
        expect(wrapper.findAll('.mouse-cell-image').length).to.equal(0);
    });

    it('Causes the cat to get all milk before getting the mouse', () => {
        placeElementAt('cat', 0, 0);
        placeElementAt('mouse', 1, 0); // Mouse right next to the cat
        placeElementAt('milk', 0, 3); // Milk 2 cells away

        wrapper.find('#play-stop').trigger('click');

        // Expect the cat to move for the milk first
        [1, 2, 3].forEach((column: number) => {
            tickOneTurn();
            expectElementAt('cat', 0, column);
        });

        expect(wrapper.findAll('.milk-cell-image').length).to.equal(0);

        // Expect the cat to come back for the mouse
        [2, 1, 0].forEach((column: number) => {
            tickOneTurn();
            expectElementAt('cat', 0, column);
        });

        tickOneTurn();
        expectElementAt('cat', 1, 0);

        expect(wrapper.findAll('.mouse-cell-image').length).to.equal(0);
    });

    it('Does not move back to the mouse corpse if the mouse happen to be in the optimal way for the milk', () => {
        placeElementAt('cat', 0, 0);
        placeElementAt('mouse', 0, 2);
        placeElementAt('milk', 0, 3);


        wrapper.find('#play-stop').trigger('click');


        // Expect the cat to move for the milk first
        [1, 2, 3].forEach((column: number) => {
            tickOneTurn();
            expectElementAt('cat', 0, column);
        });

        expect(wrapper.findAll('.milk-cell-image').length).to.equal(0);

        // At this point, since the mouse was in the milk path. It was already consumed
        // The cat won and should no longer move
        expectElementAt('cat', 0, 3);
        tickOneTurn();
        expectElementAt('cat', 0, 3);
        tickOneTurn();
        expectElementAt('cat', 0, 3);
    });
});
