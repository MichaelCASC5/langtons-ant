// Presentational modal. Props:
//   open, onClose
//   rule, onRuleChange: the turn-rule string, e.g. "RL" or "RLLR"
export default function CanvasSettingsModal({ open, onClose, rule, onRuleChange, loopBorder, onLoopBorderChange, border, onBorderChange }) {
  if (!open) return null;

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-20 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-80 rounded-xl border border-white/10 bg-neutral-900 p-5 text-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium">Settings</h2>
          <button
            type="button"
            aria-label="Close settings"
            onClick={onClose}
            className="text-white/50 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <label className="block text-xs text-white/60">
          Rule
          <input
            type="text"
            value={rule}
            onChange={(e) => onRuleChange(e.target.value)}
            placeholder="RL"
            className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-2 py-1.5 text-sm text-white outline-none focus:border-white/40"
          />
        </label>
        <p className="mt-2 text-xs leading-relaxed text-white/40">
          Each letter is a turn for one cell state: R = turn right, L = turn left. "RL" is the
          classic ant. Longer rules like "RLLR" add more colors and behaviors.
        </p>

        <label className="block text-xs text-white/60">
          Border dimension
          <input
            type="text"
            value={border}
            onChange={(e) => onBorderChange(e.target.value)}
            placeholder="insert border"
            className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-2 py-1.5 text-sm text-white outline-none focus:border-white/40"
          />
        </label>

        <div className="mb-4 flex items-center justify-between">
          <label className="r-4">Edge Wrapping:
          <input
            type="checkbox" 
            name="loop"
            checked={loopBorder} 
            onChange={(e) => onLoopBorderChange(e.target.checked)}
          />
          </label>
        </div>

      </div>
    </div>
  );
}
