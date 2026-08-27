// Headings are 0=up, 1=right, 2=down, 3=left, matching clockwise turns.
const HEADING_DELTAS = [
  { dx: 0, dy: -1 }, // up
  { dx: 1, dy: 0 }, // right
  { dx: 0, dy: 1 }, // down
  { dx: -1, dy: 0 }, // left
];

let nextAntId = 1;

export function createAnt(x, y, heading = 0, color) {
  return { id: nextAntId++, x, y, heading, color };
}

// turn is "R", "L", or "N" (no turn) / "U" (u-turn) — the classic rule
// alphabet, so extended rules like "RLLR" work without extra code.
export function turnAnt(ant, turn) {
  if (turn === "R") ant.heading = (ant.heading + 1) % 4;
  else if (turn === "L") ant.heading = (ant.heading + 3) % 4;
  else if (turn === "U") ant.heading = (ant.heading + 2) % 4;
  // "N" (no turn) falls through and leaves heading unchanged.
}

export function stepAntForward(ant) {
  const { dx, dy } = HEADING_DELTAS[ant.heading];
  ant.x += dx;
  ant.y += dy;
}

export function stepAntLinearly(ant) {
  // const { dx, dy } = HEADING_DELTAS[ant.heading];
  // ant.x += 0;
  ant.y += 1;
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
