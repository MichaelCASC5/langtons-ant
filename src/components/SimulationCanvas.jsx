import { useEffect, useRef } from "react";
import { useCanvasInteraction } from "../hooks/useCanvasInteraction.js";

// A thin wrapper: this component owns no simulation state itself. It
// just renders a <canvas>, keeps its pixel size in sync with its
// container, and delegates all pointer/wheel handling to
// useCanvasInteraction. All drawing happens imperatively via
// simulation.redraw() — never through React state — so panning and
// painting stay smooth at 60fps.
//
// canvasRef is created by the parent (Home.jsx) and also handed to
// useSimulation, so both the drawing loop and this component are
// talking to the exact same <canvas> DOM node.
export default function SimulationCanvas({ canvasRef, simulation, mode, selectedState }) {
  const containerRef = useRef(null);

  useCanvasInteraction(canvasRef, simulation, mode, selectedState);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    function resize() {
      // Buffer size matches CSS size 1:1 (no devicePixelRatio scaling)
      // so pointer coordinates line up exactly with grid coordinates.
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      simulation.redraw();
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [simulation]);

  const cursorClass =
    mode === "pan" ? "cursor-grab active:cursor-grabbing" : mode === "paint" ? "cursor-crosshair" : "cursor-copy";

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas ref={canvasRef} className={`block h-full w-full ${cursorClass}`} />
    </div>
  );
}
