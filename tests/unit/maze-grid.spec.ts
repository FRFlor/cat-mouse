import {expect} from 'chai';
import {mount, Wrapper} from '@vue/test-utils';
import MazeGrid from '@/components/MazeGrid.vue';
import GridCell from '@/classes/GridCell';
// @ts-ignore
import {CellContent} from '@/components/MazeCell';

describe('MazeGrid', () => {
    let wrapper: Wrapper<MazeGrid>;

    it('Renders all the cells for the grid', () => {
        const threeByThreeGrid: GridCell[] = 'x'.repeat(9).split('').map((_: any, position: number) =>
            new GridCell(position, CellContent.Nothing));

        wrapper = mount(MazeGrid, {propsData: {cells: threeByThreeGrid}});
        expect(wrapper.findAll('.maze-cell').length).to.equal(9);
    });
});
