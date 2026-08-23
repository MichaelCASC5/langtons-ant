import { useCallback, useEffect, useRef, useState } from "react";
import {
  createSimulation,
  stepSimulation,
  resetSimulation,
  addAnt,
  paintCell,
  setRule,
  DEFAULT_RULE,
} from "../engine/simulation.js";
import { createCamera } from "../engine/camera.js";
import { drawFrame } from "../engine/renderer.js";

// This hook is the glue layer between the plain-JS engine and React.
// Simulation state (grid, ants, camera) lives in refs and is mutated
// directly every frame — putting it in React state would mean a
// re-render per tick, which is far too slow for an animation loop.
// A handful of *display* values (step count, ant count) are mirrored
// into React state, but only a few times a second, just so the stats
// panel can show them.
export function useSimulation(canvasRef) {
  const simRef = useRef(null);
  if (simRef.current === null) simRef.current = createSimulation();

  const cameraRef = useRef(null);
  if (cameraRef.current === null) cameraRef.current = createCamera();

  const runningRef = useRef(false);
  const speedRef = useRef(1);
  const rafRef = useRef(null);
  const lastStatsUpdateRef = useRef(0);

  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeedState] = useState(1);
  const [stepCount, setStepCount] = useState(0);
  const [antCount, setAntCount] = useState(0);
  const [rule, setRuleState] = useState(DEFAULT_RULE);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    drawFrame(ctx, canvas, simRef.current, cameraRef.current);
  }, [canvasRef]);

  useEffect(() => {
    function frame(now) {
      if (runningRef.current) {
        for (let i = 0; i < speedRef.current; i++) {
          stepSimulation(simRef.current);
        }
      }
      redraw();
      if (now - lastStatsUpdateRef.current > 150) {
        lastStatsUpdateRef.current = now;
        setStepCount(simRef.current.stepCount);
        setAntCount(simRef.current.ants.length);
      }
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [redraw]);

  const play = useCallback(() => {
    runningRef.current = true;
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    runningRef.current = false;
    setIsRunning(false);
  }, []);

  const togglePlay = useCallback(() => {
    runningRef.current = !runningRef.current;
    setIsRunning(runningRef.current);
  }, []);

  const step = useCallback(() => {
    stepSimulation(simRef.current);
    setStepCount(simRef.current.stepCount);
    setAntCount(simRef.current.ants.length);
    redraw();
  }, [redraw]);

  const reset = useCallback(() => {
    resetSimulation(simRef.current);
    setStepCount(0);
    setAntCount(0);
    redraw();
  }, [redraw]);

  const changeSpeed = useCallback((value) => {
    speedRef.current = value;
    setSpeedState(value);
  }, []);

  const changeRule = useCallback((value) => {
    setRule(simRef.current, value);
    setRuleState(simRef.current.rule);
  }, []);

  const addAntAt = useCallback(
    (x, y) => {
      addAnt(simRef.current, x, y, null, Math.floor(Math.random() * 5) + 0);
      setAntCount(simRef.current.ants.length);
    },
    []
  );

  const paintCellAt = useCallback((x, y, state) => {
    paintCell(simRef.current, x, y, state);
  }, []);

  return {
    simRef,
    cameraRef,
    isRunning,
    speed,
    stepCount,
    antCount,
    rule,
    colors: simRef.current.colors,
    play,
    pause,
    togglePlay,
    step,
    reset,
    changeSpeed,
    changeRule,
    addAntAt,
    paintCellAt,
    redraw,
  };
}
