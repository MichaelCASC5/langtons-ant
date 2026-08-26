import { useEffect, useRef } from "react";
import { panBy, zoomAt, screenToCell } from "../engine/camera.js";

// Wires pointer + wheel events on the canvas to camera pan/zoom and
// simulation actions (placing ants, painting cells). "mode" decides
// what a click does; the wheel always zooms, regardless of mode.
export function useCanvasInteraction(canvasRef, simulation, mode, selectedState, selectedColor) {
  const isDraggingRef = useRef(false);
  const isPaintingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function canvasPoint(e) {
      const rect = canvas.getBoundingClientRect();
      return { px: e.clientX - rect.left, py: e.clientY - rect.top };
    }

    function paintAt(e) {
      const { px, py } = canvasPoint(e);
      const { cx, cy } = screenToCell(simulation.cameraRef.current, canvas.width, canvas.height, px, py);
      simulation.paintCellAt(cx, cy, selectedState, selectedColor);
      simulation.redraw();
    }

    function handlePointerDown(e) {
      canvas.setPointerCapture(e.pointerId);
      const { px, py } = canvasPoint(e);

      if (mode === "place-ant") {
        const { cx, cy } = screenToCell(simulation.cameraRef.current, canvas.width, canvas.height, px, py);
        simulation.addAntAt(cx, cy, selectedColor);
        simulation.redraw();
      } else if (mode === "place-spawner") {
        const { cx, cy } = screenToCell(simulation.cameraRef.current, canvas.width, canvas.height, px, py);
        simulation.addSpawnerAt(cx, cy, selectedColor);
        simulation.redraw();
      } else if (mode === "paint") {
        isPaintingRef.current = true;
        paintAt(e);
      } else { // for any mode whose behavior is unspecified, use as a pan
        isDraggingRef.current = true;
        lastPointerRef.current = { x: e.clientX, y: e.clientY };
      }
    }

    function handlePointerMove(e) {
      if (isDraggingRef.current) {
        const dx = e.clientX - lastPointerRef.current.x;
        const dy = e.clientY - lastPointerRef.current.y;
        lastPointerRef.current = { x: e.clientX, y: e.clientY };
        panBy(simulation.cameraRef.current, dx, dy);
        simulation.redraw();
      } else if (isPaintingRef.current) {
        paintAt(e);
      }
    }

    function handlePointerUp() {
      isDraggingRef.current = false;
      isPaintingRef.current = false;
    }

    function handleWheel(e) {
      e.preventDefault();
      const { px, py } = canvasPoint(e);
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      zoomAt(simulation.cameraRef.current, canvas.width, canvas.height, px, py, factor);
      simulation.redraw();
    }

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [canvasRef, simulation, mode, selectedState]);
}
