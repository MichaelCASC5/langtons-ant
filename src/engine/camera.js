const MIN_ZOOM = 0.15;
const MAX_ZOOM = 8;

export function createCamera(baseCellSize = 18) {
  return {
    x: 0, // grid coordinate currently at the center of the screen
    y: 0,
    zoom: 0.2,
    baseCellSize, // pixels per cell at zoom = 1
  };
}

export function cellSizePx(camera) {
  return camera.baseCellSize * camera.zoom;
}

// Screen pixel -> fractional grid coordinate.
export function screenToGrid(camera, canvasWidth, canvasHeight, px, py) {
  const size = cellSizePx(camera);
  return {
    gx: camera.x + (px - canvasWidth / 2) / size,
    gy: camera.y + (py - canvasHeight / 2) / size,
  };
}

// Screen pixel -> the integer cell coordinate under that pixel.
export function screenToCell(camera, canvasWidth, canvasHeight, px, py) {
  const { gx, gy } = screenToGrid(camera, canvasWidth, canvasHeight, px, py);
  return { cx: Math.floor(gx), cy: Math.floor(gy) };
}

// Grid coordinate -> screen pixel (top-left corner of that cell).
export function gridToScreen(camera, canvasWidth, canvasHeight, gx, gy) {
  const size = cellSizePx(camera);
  return {
    px: canvasWidth / 2 + (gx - camera.x) * size,
    py: canvasHeight / 2 + (gy - camera.y) * size,
  };
}

export function panBy(camera, dxPx, dyPx) {
  const size = cellSizePx(camera);
  camera.x -= dxPx / size;
  camera.y -= dyPx / size;
}

// Zooms while keeping the grid point under (anchorPx, anchorPy) fixed
// on screen, which is what makes scroll-to-zoom feel natural.
export function zoomAt(camera, canvasWidth, canvasHeight, anchorPx, anchorPy, factor) {
  const before = screenToGrid(camera, canvasWidth, canvasHeight, anchorPx, anchorPy);
  camera.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, camera.zoom * factor));
  const after = screenToGrid(camera, canvasWidth, canvasHeight, anchorPx, anchorPy);
  camera.x += before.gx - after.gx;
  camera.y += before.gy - after.gy;
}
