
let nextSpawnerId = 1;

export function createSpawner(x, y, color, berserk) {
  return { id: nextSpawnerId++, x, y, color, berserk };
}

export function stepSpawnerRandomly(spawner) {
  let directions = [-1, 0, 1]

  let normalChance = 0.02

  if (spawner.berserk) {
    normalChance = 1

    if (Math.random() < 0.002) {
      spawner.berserk = false
    }
  }

  if (Math.random() < normalChance) {
    spawner.x += directions[Math.floor(Math.random() * directions.length)]
    spawner.y += directions[Math.floor(Math.random() * directions.length)]
  }
  
}

export function loopSpawnerNear(sim, x, y) {
  const index = sim.spawners.findIndex((a) => a.x === x && a.y === y);
  const spawner = sim.spawners[index]

  if (spawner.x < sim.border[0]) {
    spawner.x = sim.border[2]
  }
  if (spawner.y < sim.border[1]) {
    spawner.y = sim.border[3]
  }
  
  if (spawner.x > sim.border[2]) {
    spawner.x = sim.border[0]
  }
  if (spawner.y > sim.border[3]) {
    spawner.y = sim.border[1]
  }
}
