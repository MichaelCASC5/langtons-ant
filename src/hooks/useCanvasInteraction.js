import { useEffect, useRef } from "react";
import { panBy, zoomAt, screenToCell } from "../engine/camera.js";

// Wires pointer + wheel events on the canvas to camera pan/zoom and
// simulation actions (placing ants, painting cells). "mode" decides
// what a single touch/click does; the wheel (desktop) and a two-finger
// pinch (touch) always zoom, regardless of mode.
export function useCanvasInteraction(canvasRef, simulation, mode, selectedState, selectedColor) {
  const isDraggingRef = useRef(false);
  const isPaintingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  // Tracks every currently-active touch/pointer by id, so a single
  // finger (place ant / paint / pan) can be told apart from a second
  // finger landing to start a pinch. Also tracks the pinch's previous
  // distance/midpoint so each move event can compute how much the
  // pinch changed since the last frame.
  const activePointersRef = useRef(new Map());
  const pinchRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function clientToCanvas(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      return { px: clientX - rect.left, py: clientY - rect.top };
    }

    function canvasPoint(e) {
      return clientToCanvas(e.clientX, e.clientY);
    }

    function pinchInfo() {
      const [a, b] = Array.from(activePointersRef.current.values());
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      return {
        distance: Math.hypot(dx, dy),
        midClientX: (a.x + b.x) / 2,
        midClientY: (a.y + b.y) / 2,
      };
    }

    function paintAt(e) {
      const { px, py } = canvasPoint(e);
      const { cx, cy } = screenToCell(simulation.cameraRef.current, canvas.width, canvas.height, px, py);
      simulation.paintCellAt(cx, cy, selectedState, selectedColor);
      simulation.redraw();
    }

    function handlePointerDown(e) {
      canvas.setPointerCapture(e.pointerId);
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // A second finger landing means "start a pinch" — cancel whatever
      // the first finger was doing (panning or painting) so the two
      // gestures don't fight each other. This never affects place-ant
      // or place-spawner, since those fire once on pointerdown and have
      // no "in progress" state to cancel.
      if (activePointersRef.current.size === 2) {
        isDraggingRef.current = false;
        isPaintingRef.current = false;
        pinchRef.current = pinchInfo();
        return;
      }
      if (activePointersRef.current.size > 2) return; // ignore extra fingers

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
      if (!activePointersRef.current.has(e.pointerId)) return;
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointersRef.current.size === 2 && pinchRef.current) {
        const info = pinchInfo();
        const factor = info.distance / pinchRef.current.distance;
        const { px, py } = clientToCanvas(info.midClientX, info.midClientY);
        zoomAt(simulation.cameraRef.current, canvas.width, canvas.height, px, py, factor);
        pinchRef.current = info;
        simulation.redraw();
        return;
      }

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

    function handlePointerUp(e) {
      activePointersRef.current.delete(e.pointerId);
      if (activePointersRef.current.size < 2) {
        pinchRef.current = null;
      }
      if (activePointersRef.current.size === 0) {
        isDraggingRef.current = false;
        isPaintingRef.current = false;
      }
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
  }, [canvasRef, simulation, mode, selectedState, selectedColor]);
}
