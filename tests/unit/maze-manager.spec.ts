import {expect} from 'chai';
import {mount, Wrapper} from '@vue/test-utils';
import MazeManager from '@/components/MazeManager.vue';

describe('HelloWorld.vue', () => {
    let wrapper: Wrapper<MazeManager>;
    const currentGridSize = (): number => Math.floor(wrapper.findAll('.maze-cell').length ** 0.5);

    beforeEach(() => {
        wrapper = mount(MazeManager);
    });

    it('Starts with the maze at size 10', () => {
        expect(currentGridSize()).to.equal(10);
    });

    it('Increases the maze size when the increase-maze-size button is clicked', () => {
        expect(currentGridSize()).to.equal(10);

        wrapper.find('#increase-maze-size').trigger('click');
        expect(currentGridSize()).to.equal(11);

        wrapper.find('#increase-maze-size').trigger('click');
        expect(currentGridSize()).to.equal(12);
    });

    it('Decreases the maze size when the decrease-maze-size button is clicked', () => {
        expect(currentGridSize()).to.equal(10);

        wrapper.find('#decrease-maze-size').trigger('click');
        expect(currentGridSize()).to.equal(9);

        wrapper.find('#decrease-maze-size').trigger('click');
        expect(currentGridSize()).to.equal(8);
    });

    it('Does not allow the maze size to be under 7', () => {
        expect(currentGridSize()).to.equal(10);
        wrapper.find('#decrease-maze-size').trigger('click');
        wrapper.find('#decrease-maze-size').trigger('click');
        expect(currentGridSize()).to.equal(8);
        wrapper.find('#decrease-maze-size').trigger('click');
        expect(currentGridSize()).to.equal(7);
        wrapper.find('#decrease-maze-size').trigger('click');
        wrapper.find('#decrease-maze-size').trigger('click');
        expect(currentGridSize()).to.equal(7);
    });
});
