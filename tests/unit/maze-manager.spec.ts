import {expect} from 'chai';
import {mount, Wrapper} from '@vue/test-utils';
import MazeManager from '@/components/MazeManager.vue';

describe('MazeManager', () => {
    let wrapper: Wrapper<MazeManager>;

    const currentGridSize = (): number => Math.floor(wrapper.findAll('.maze-cell').length ** 0.5);
    const placeElementAt = (elementName: string, row: number, column: number) => {
        const position: number = column + row * currentGridSize();

        wrapper.find(`#${elementName}-select`).trigger('click');
        wrapper.findAll('.maze-cell').at(position).trigger('click');
    };

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

    it('Allows the user to place an element into the grid', () => {
        // Adding a milk cell
        expect(wrapper.find('.milk-cell-image').exists()).to.equal(false);
        placeElementAt('milk', 0, 0);
        expect(wrapper.find('.milk-cell-image').exists()).to.equal(true);

        // Replacing the milk cell for a cat cell
        expect(wrapper.find('.milk-cell-image').exists()).to.equal(true);
        expect(wrapper.find('.cat-cell-image').exists()).to.equal(false);
        placeElementAt('cat', 0, 0);
        expect(wrapper.find('.milk-cell-image').exists()).to.equal(false);
        expect(wrapper.find('.cat-cell-image').exists()).to.equal(true);
    });

    it('Prevents more than 1 cat to be present in the grid', () => {
        expect(wrapper.findAll('.cat-cell-image').length).to.equal(0);
        placeElementAt('cat', 0, 0);
        expect(wrapper.findAll('.cat-cell-image').length).to.equal(1);
        placeElementAt('cat', 0, 3);
        expect(wrapper.findAll('.cat-cell-image').length).to.equal(1);
    });

    it('Prevents more than 1 mouse to be present in the grid', () => {
        expect(wrapper.findAll('.mouse-cell-image').length).to.equal(0);
        placeElementAt('mouse', 0, 0);
        expect(wrapper.findAll('.mouse-cell-image').length).to.equal(1);
        placeElementAt('mouse', 0, 3);
        expect(wrapper.findAll('.mouse-cell-image').length).to.equal(1);
    });
});
