import { createGrid, getCell, setCell, clearGrid } from "./grid.js";
import { createAnt, turnAnt, stepAntForward, stepAntLinearly } from "./ant.js";
import { createSpawner } from "./spawner.js";

// A palette of state colors. Index 0 is always "empty" and is never
// drawn (the canvas background shows through). Extend this array to
// support rules with more than 2 states (e.g. "RLLR" needs 4 colors).
export const DEFAULT_COLORS = [
  "#00000000", // 0: empty (transparent — background shows through)
  "#0F6E56", // 1: teal
  "#D85A30", // 2: coral
  "#185FA5", // 3: blue
  "#854F0B", // 4: amber
];

export const DEFAULT_RULE = "RL"; // classic two-state Langton's Ant

export function createSimulation() {
  return {
    grid: createGrid(),
    border: [-100, -100, 100, 100],
    ants: [],
    spawners: [],
    rule: DEFAULT_RULE,
    colors: DEFAULT_COLORS,
    stepCount: 0,
  };
}

export function setRule(sim, rule) {
  const cleaned = rule.toUpperCase().replace(/[^RLNU]/g, "");
  sim.rule = cleaned.length > 0 ? cleaned : DEFAULT_RULE;
}

export function addAnt(sim, x, y, heading = 0, color) {
  const ant = createAnt(x, y, heading, color);
  sim.ants.push(ant);
  return ant;
}

export function addSpawner(sim, x, y, color) {
  const spawner = createSpawner(x, y, color);
  sim.spawners.push(spawner);
  return spawner;
}

export function removeAntNear(sim, x, y) {
  const index = sim.ants.findIndex((a) => a.x === x && a.y === y);
  if (index !== -1) sim.ants.splice(index, 1);
}

export function loopAntNear(sim, x, y) {
  const index = sim.ants.findIndex((a) => a.x === x && a.y === y);
  const ant = sim.ants[index]

  if (ant.x < sim.border[0]) {
    ant.x = sim.border[2]
  }
  if (ant.y < sim.border[1]) {
    ant.y = sim.border[3]
  }
  
  if (ant.x > sim.border[2]) {
    ant.x = sim.border[0]
  }
  if (ant.y > sim.border[3]) {
    ant.y = sim.border[1]
  }
}

export function removeAntDuplicates(sim) {
  for (let i = 0; i < sim.ants.length; i++) {
    for (let j = i + 1; j < sim.ants.length; j++) {
      if (sim.ants[i].x == sim.ants[j].x && sim.ants[i].y == sim.ants[j].y) {
        removeAntNear(sim, sim.ants[i].x, sim.ants[i].y)
      }
    }
  }
}

export function paintCell(sim, x, y, state, color) {
  setCell(sim.grid, x, y, state, color);
}

export function resetSimulation(sim) {
  sim.ants = [];
  sim.spawners = [];
  clearGrid(sim.grid)
  sim.stepCount = 0;
}

// Advances every ant by exactly one tick. Each ant reads the state of
// the cell it's standing on, turns according to the rule for that
// state, flips the cell to the next state, then moves forward.
export function stepSimulation(sim) {
  if (sim.stepCount == 0) {
    console.log("stepCount is 0")
    generateSpawners(sim)
  }
  
  removeAntDuplicates(sim)

  // Spawn ants perpetually at spawners
  for (const spawner of sim.spawners) {

    if (Math.floor(Math.random() * 100) < 1) {

      // Only the first ant emited by a colored spawner has a color. The spawner then emits neutral ants afterwards
      let spawnColor = 0
      if (spawner.color != 0) {
        spawnColor = spawner.color
        spawner.color = 0
      }

      addAnt(sim, spawner.x, spawner.y, null, spawnColor)
    }
  }

  // Move the ants
  const numStates = sim.rule.length;
  for (const ant of sim.ants) {
    
    const cell = getCell(sim.grid, ant.x, ant.y);
    const state = cell[0]

    // If the ant has no color yet assigned, it is not to build nor move as an ant should
    if (ant.color != 0) {
      const turn = sim.rule[state % numStates];
      turnAnt(ant, turn);
      const nextState = (state + 1) % numStates;

      setCell(sim.grid, ant.x, ant.y, nextState, ant.color);
      stepAntForward(ant);
    } else {
      stepAntLinearly(ant);
      if (state == 1)
        ant.color = cell[1]
    }

    // If an ant goes out of bounds, destroy it
    if ((ant.x < sim.border[0] || ant.x > sim.border[2]) || (ant.y < sim.border[1] || ant.y > sim.border[3])) {
      // removeAntNear(sim, ant.x, ant.y)
      loopAntNear(sim, ant.x, ant.y)
    }
  }

  sim.stepCount += 1;
}

function generateSpawners(sim) {
  console.log("generateSpawners() fired")

  for (let i = sim.border[0]; i < sim.border[2]; i++) {
    for (let j = sim.border[1]; j < sim.border[3]; j++) {

      if (Math.random() * 100 < 0.02) {
        addSpawner(sim, i, j, Math.floor(Math.random() * DEFAULT_COLORS.length) + 1)
      }

    }
  }

}
