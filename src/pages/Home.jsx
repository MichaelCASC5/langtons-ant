import { useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import SimulationCanvas from "../components/SimulationCanvas.jsx";
import Toolbar from "../components/Toolbar.jsx";
import ControlPanel from "../components/ControlPanel.jsx";
import StatsPanel from "../components/StatsPanel.jsx";
import CanvasSettingsModal from "../components/CanvasSettingsModal.jsx";
import InfoModal from "../components/InfoModal.jsx";
import Hero from "../components/Hero.jsx";
import { useSimulation } from "../hooks/useSimulation.js";
import { useFullscreen } from "../hooks/useFullscreen.js";

export default function Home() {
  // Shared by useSimulation (draws into it every frame) and
  // SimulationCanvas (renders it and attaches pointer/wheel handlers) —
  // both need to reference the exact same <canvas> DOM node.
  const canvasRef = useRef(null);
  const rootRef = useRef(null); // the element that goes fullscreen

  const simulation = useSimulation(canvasRef);
  const { isFullscreen, toggleFullscreen } = useFullscreen(rootRef);

  const [showHero, setShowHero] = useState(true);
  const [mode, setMode] = useState("place-ant");
  const [selectedState, setSelectedState] = useState(1);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isInfoOpen, setInfoOpen] = useState(false);

  return (
    <MainLayout>
      <div ref={rootRef} className="relative h-full w-full">
        <SimulationCanvas canvasRef={canvasRef} simulation={simulation} mode={mode} selectedState={selectedState} />

        <div className="pointer-events-none absolute inset-0 z-10">
          <Toolbar
            mode={mode}
            onModeChange={setMode}
            colors={simulation.colors}
            selectedState={selectedState}
            onSelectColor={setSelectedState}
          />

          <StatsPanel antCount={simulation.antCount} stepCount={simulation.stepCount} />

          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <ControlPanel
              isRunning={simulation.isRunning}
              onPlayPause={simulation.togglePlay}
              onStep={simulation.step}
              onReset={simulation.reset}
              speed={simulation.speed}
              onSpeedChange={simulation.changeSpeed}
            />

            <div className="pointer-events-auto flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 p-1.5 backdrop-blur-sm">
              <IconButton label="Settings" onClick={() => setSettingsOpen(true)}>
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 008.6 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H2a2 2 0 110-4h.09A1.65 1.65 0 003.6 8.6a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H8a1.65 1.65 0 001-1.51V2a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V8a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </IconButton>
              <IconButton label={isFullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={toggleFullscreen}>
                <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M16 21h3a2 2 0 002-2v-3M8 21H5a2 2 0 01-2-2v-3" />
              </IconButton>
              <IconButton label="About" onClick={() => setInfoOpen(true)}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </IconButton>
            </div>
          </div>
        </div>

        {showHero && <Hero onStart={() => setShowHero(false)} />}
        <CanvasSettingsModal
          open={isSettingsOpen}
          onClose={() => setSettingsOpen(false)}
          rule={simulation.rule}
          onRuleChange={simulation.changeRule}
        />
        <InfoModal open={isInfoOpen} onClose={() => setInfoOpen(false)} />
      </div>
    </MainLayout>
  );
}

function IconButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}
