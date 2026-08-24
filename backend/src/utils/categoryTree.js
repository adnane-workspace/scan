export const MAX_CATEGORY_DEPTH = 8;

export function parentKey(parentId) {
  return parentId || '';
}

export function groupByParent(categories) {
  const groups = new Map();

  for (const category of categories) {
    const key = parentKey(category.parentId);
    const siblings = groups.get(key);

    if (siblings) {
      siblings.push(category);
    } else {
      groups.set(key, [category]);
    }
  }

  return groups;
}

export function collectDescendantIds(categories, categoryId) {
  const byParent = groupByParent(categories);
  const ids = [];
  const stack = [...(byParent.get(categoryId) || [])];

  while (stack.length > 0) {
    const node = stack.pop();
    ids.push(node.id);
    stack.push(...(byParent.get(node.id) || []));
  }

  return ids;
}

export function nodeDepth(categories, categoryId) {
  const byId = new Map(categories.map((category) => [category.id, category]));
  let depth = 0;
  let current = byId.get(categoryId);
  const seen = new Set();

  while (current) {
    if (seen.has(current.id)) {
      break;
    }

    seen.add(current.id);
    depth += 1;
    current = current.parentId ? byId.get(current.parentId) : null;
  }

  return depth;
}

export function subtreeHeight(categories, categoryId) {
  const byParent = groupByParent(categories);
  let maxHeight = 1;
  const stack = (byParent.get(categoryId) || []).map((child) => ({ id: child.id, height: 2 }));

  while (stack.length > 0) {
    const node = stack.pop();
    maxHeight = Math.max(maxHeight, node.height);
    for (const child of byParent.get(node.id) || []) {
      stack.push({ id: child.id, height: node.height + 1 });
    }
  }

  return maxHeight;
}

export function subtreeProductCounts(categories, directCounts) {
  const byParent = groupByParent(categories);
  const totals = new Map();

  function count(categoryId) {
    if (totals.has(categoryId)) {
      return totals.get(categoryId);
    }

    const children = byParent.get(categoryId) || [];
    const total =
      (directCounts.get(categoryId) || 0) + children.reduce((sum, child) => sum + count(child.id), 0);
    totals.set(categoryId, total);
    return total;
  }

  for (const category of categories) {
    count(category.id);
  }

  return totals;
}
