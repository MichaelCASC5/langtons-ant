import { forEachCell } from "./grid.js";
import { cellSizePx, gridToScreen } from "./camera.js";

const BACKGROUND = "#111111";
const GRID_LINE = "rgba(255, 255, 255, 0.06)";
const ANT_COLOR = "#F4F1EA";

export function drawFrame(ctx, canvas, sim, camera) {
  const width = canvas.width;
  const height = canvas.height;
  const size = cellSizePx(camera);

  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, width, height);

  // Faint grid lines only render once cells are big enough to be worth
  // showing — at low zoom they'd just be visual noise.
  if (size >= 6) {
    drawGridLines(ctx, width, height, camera, size);
  }

  forEachCell(sim.grid, (gx, gy, state, color) => {
    if (state === 0) return;
    const { px, py } = gridToScreen(camera, width, height, gx, gy);
    if (px + size < 0 || py + size < 0 || px > width || py > height) return;
    ctx.fillStyle = sim.colors[color] ?? sim.colors[1];
    ctx.fillRect(Math.floor(px), Math.floor(py), Math.ceil(size), Math.ceil(size));
  });

  for (const ant of sim.ants) {
    drawAnt(ctx, width, height, camera, size, ant);
  }

  for (const spawner of sim.spawners) {
    drawSpawner(ctx, width, height, camera, size, spawner);
  }
}

function drawGridLines(ctx, width, height, camera, size) {
  ctx.strokeStyle = GRID_LINE;
  ctx.lineWidth = 1;
  const { px: originX } = gridToScreen(camera, width, height, Math.floor(camera.x), 0);
  const startX = originX % size;
  ctx.beginPath();
  for (let x = startX; x < width; x += size) {
    ctx.moveTo(Math.floor(x) + 0.5, 0);
    ctx.lineTo(Math.floor(x) + 0.5, height);
  }
  const { py: originY } = gridToScreen(camera, width, height, 0, Math.floor(camera.y));
  const startY = originY % size;
  for (let y = startY; y < height; y += size) {
    ctx.moveTo(0, Math.floor(y) + 0.5);
    ctx.lineTo(width, Math.floor(y) + 0.5);
  }
  ctx.stroke();
}

// Draws a small triangle pointing in the ant's current heading so
// direction is visible at a glance, especially with multiple ants.
function drawAnt(ctx, width, height, camera, size, ant) {
  const { px, py } = gridToScreen(camera, width, height, ant.x, ant.y);
  if (px + size < 0 || py + size < 0 || px > width || py > height) return;

  const cx = px + size / 2;
  const cy = py + size / 2;
  const r = size * 0.55;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((Math.PI / 2) * ant.heading);
  ctx.fillStyle = ANT_COLOR;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(r * 0.7, r * 0.7);
  ctx.lineTo(-r * 0.7, r * 0.7);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Draws a small circle around the position of a spawner
function drawSpawner(ctx, width, height, camera, size, ant) {
  const { px, py } = gridToScreen(camera, width, height, ant.x, ant.y);
  if (px + size < 0 || py + size < 0 || px > width || py > height) return;

  const cx = px + size / 2;
  const cy = py + size / 2;
  const r = size * 0.55;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = "transparent"
  ctx.beginPath();
  ctx.beginPath();
  ctx.arc(0, 0, 2 * r, 0, 2 * Math.PI);
  ctx.lineWidth = 2
  ctx.strokeStyle = "rgba(220, 220, 220)"
  ctx.stroke();
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
