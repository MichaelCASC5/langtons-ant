// A sparse, effectively-infinite grid. Cells default to state 0 (empty)
// and we only store cells that have been touched, so the grid can grow
// in any direction without allocating a fixed-size array up front.

export function createGrid() {
  return new Map();
}

function key(x, y) {
  return `${x},${y}`;
}

export function getCell(grid, x, y) {
  const value = grid.get(key(x, y));
  // return value === undefined ? 0 : value[0];
  return value === undefined ? [0,0] : value
}

export function setCell(grid, x, y, state, color) {
  if (state === 0) {
    // Storing zeros would defeat the point of a sparse grid, so an
    // explicit reset to "empty" just deletes the entry.
    grid.delete(key(x, y));
  } else {
    grid.set(key(x, y), [state, color]);
  }
}

export function clearGrid(grid) {
  grid.clear();
}

// Iterates only the cells that have actually been set — used by the
// renderer so drawing cost tracks "ink on the page", not grid size.
export function forEachCell(grid, callback) {
  for (const [k, [state, color]] of grid) {
    const commaIndex = k.indexOf(",");
    const x = Number(k.slice(0, commaIndex));
    const y = Number(k.slice(commaIndex + 1));
    callback(x, y, state, color);
  }
}
