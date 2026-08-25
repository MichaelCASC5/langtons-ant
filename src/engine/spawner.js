
let nextSpawnerId = 1;

export function createSpawner(x, y, color) {
  return { id: nextSpawnerId++, x, y, color };
}
