import { sortCategoriesParentsFirst } from '../../src/services/trial.service.js';

describe('sortCategoriesParentsFirst', () => {
  it('puts parents before children', () => {
    const sorted = sortCategoriesParentsFirst([
      { id: 'child', parentId: 'parent', order: 0 },
      { id: 'parent', parentId: null, order: 1 },
      { id: 'root', parentId: null, order: 0 },
    ]);

    expect(sorted.map((item) => item.id)).toEqual(['root', 'parent', 'child']);
  });
});
