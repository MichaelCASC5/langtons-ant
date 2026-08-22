// Presentational only. Props:
//   isRunning, onPlayPause, onStep, onReset: playback controls
//   speed, onSpeedChange: steps-per-frame, 1-50
export default function ControlPanel({ isRunning, onPlayPause, onStep, onReset, speed, onSpeedChange }) {
  return (
    <div className="pointer-events-auto flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 p-1.5 backdrop-blur-sm">
      <button
        type="button"
        aria-label={isRunning ? "Pause" : "Play"}
        onClick={onPlayPause}
        className="flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white"
      >
        {isRunning ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M7 4l13 8-13 8V4z" />
          </svg>
        )}
      </button>

      <button
        type="button"
        aria-label="Step once"
        onClick={onStep}
        className="flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M6 4l10 8-10 8V4z" />
          <rect x="17" y="4" width="2" height="16" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Reset"
        onClick={onReset}
        className="flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12a9 9 0 109-9" strokeLinecap="round" />
          <path d="M3 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="mx-1 h-5 w-px bg-white/15" />

      <label className="flex items-center gap-2 pr-2 text-xs text-white/60">
        Speed
        <input
          type="range"
          min="1"
          max="50"
          step="1"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-20 accent-white"
        />
      </label>
    </div>
  );
}
