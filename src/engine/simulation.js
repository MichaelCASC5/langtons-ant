import { createGrid, getCell, setCell, clearGrid } from "./grid.js";
import { createAnt, turnAnt, stepAntForward, stepAntLinearly } from "./ant.js";

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
    ants: [],
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

export function removeAntNear(sim, x, y) {
  const index = sim.ants.findIndex((a) => a.x === x && a.y === y);
  if (index !== -1) sim.ants.splice(index, 1);
}

export function paintCell(sim, x, y, state) {
  setCell(sim.grid, x, y, state);
}

export function resetSimulation(sim) {
  clearGrid(sim.grid);
  sim.ants = [];
  sim.stepCount = 0;
}

// Advances every ant by exactly one tick. Each ant reads the state of
// the cell it's standing on, turns according to the rule for that
// state, flips the cell to the next state, then moves forward.
export function stepSimulation(sim) {
  const numStates = sim.rule.length;
  for (const ant of sim.ants) {
    
    const cell = getCell(sim.grid, ant.x, ant.y);
    const state = cell[0]

    // If the ant has no color yet assigned, it is not to build nor move as an ant should
    if (ant.color != 0) {
      const turn = sim.rule[state % numStates];
      turnAnt(ant, turn);
      const nextState = (state + 1) % numStates;
      console.log("stepSimulation:")
      console.log(state)

      setCell(sim.grid, ant.x, ant.y, nextState, ant.color);
      stepAntForward(ant);
    } else {
      stepAntLinearly(ant);
      if (state == 1)
        ant.color = cell[1]
    }

    // If an ant goes out of bounds, destroy it
    if ((ant.x < -100 || ant.x > 100) && (ant.y < -100 || ant.y > 100)) {
      removeAntNear(sim, ant.x, ant.y)
    }
  }
  sim.stepCount += 1;
}
