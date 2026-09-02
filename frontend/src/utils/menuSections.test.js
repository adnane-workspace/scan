import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getActiveSections,
  getSectionMenuDestination,
  isLegacyCategoryId,
  isMenuSectionKey,
  resolveSectionCategory,
} from './menuSections.js';

const menu = {
  sections: [
    {
      key: 'restaurant',
      name: 'Restaurant',
      children: [
        { id: 'cat-1', name: 'Plats', products: [{ id: 'p1' }, { id: 'p2' }] },
        { id: 'cat-2', name: 'Desserts', products: [] },
      ],
    },
    {
      key: 'cafe',
      name: 'Café',
      children: [{ id: 'cat-3', name: 'Boissons', products: [{ id: 'p3' }] }],
    },
  ],
};

test('getActiveSections keeps sections with children only', () => {
  const sections = getActiveSections({
    sections: [
      { key: 'restaurant', children: [{ id: 'a' }] },
      { key: 'cafe', children: [] },
    ],
  });

  assert.equal(sections.length, 1);
  assert.equal(sections[0].key, 'restaurant');
});

test('resolveSectionCategory picks first child by default', () => {
  const section = menu.sections[0];
  const result = resolveSectionCategory(section, null);

  assert.equal(result.category.id, 'cat-1');
  assert.equal(result.products.length, 2);
});

test('getActiveSections respects section visibility', () => {
  const sections = getActiveSections({
    cafe: { menuUi: { sectionVisibility: { restaurant: true, cafe: false } } },
    sections: [
      { key: 'restaurant', children: [{ id: 'a' }] },
      { key: 'cafe', children: [{ id: 'b' }] },
    ],
  });

  assert.equal(sections.length, 1);
  assert.equal(sections[0].key, 'restaurant');
});

test('getSectionMenuDestination opens first category when one section is visible', () => {
  const paths = {
    categories: '/categories',
    sections: '/sections',
    section: (key) => `/${key}`,
    sectionCategory: (key, id) => `/${key}/${id}`,
  };

  const destination = getSectionMenuDestination(
    {
      cafe: { menuUi: { sectionsEnabled: true, sectionVisibility: { restaurant: true, cafe: false } } },
      sections: [
        {
          key: 'restaurant',
          children: [{ id: 'cat-1' }],
        },
        {
          key: 'cafe',
          children: [{ id: 'cat-2' }],
        },
      ],
    },
    paths,
  );

  assert.equal(destination, '/restaurant/cat-1');
});

test('isMenuSectionKey accepts custom slugs', () => {
  assert.equal(isMenuSectionKey('cafe'), true);
  assert.equal(isMenuSectionKey('bar'), true);
  assert.equal(isMenuSectionKey('patisserie'), true);
  assert.equal(isMenuSectionKey('Bad Key'), false);
});

test('legacy ids are detected', () => {
  assert.equal(isLegacyCategoryId('550e8400-e29b-41d4-a716-446655440000'), true);
  assert.equal(isLegacyCategoryId('restaurant'), false);
  assert.equal(isMenuSectionKey('cafe'), true);
});
