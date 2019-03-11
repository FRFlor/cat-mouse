import {expect} from 'chai';
import {mount, Wrapper} from '@vue/test-utils';
// @ts-ignore
import MazeCell, {CellContent} from '@/components/MazeCell.vue';
import GridCell from '@/classes/GridCell';


describe('MazeCell', () => {
    let wrapper: Wrapper<MazeCell>;

    describe('Displays the proper asset based on the Cell Content', () => {
        [CellContent.Cat, CellContent.Mouse, CellContent.Milk].forEach(
            (content: CellContent) => {
                it(`Renders a ${content}`, () => {
                    wrapper = mount(MazeCell, {propsData: {cellData: new GridCell(0, content)}});
                    expect(wrapper.find(`.${content}-cell-image`.toLowerCase()).exists()).to.equal(true);
                });
            },
        );
    });
});
