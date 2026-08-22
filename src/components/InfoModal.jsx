// Presentational modal, reusing the same overlay pattern as
// ProjectModal.jsx in the main site template. Props: open, onClose
export default function InfoModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-20 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-96 max-w-[calc(100vw-2rem)] rounded-xl border border-white/10 bg-neutral-900 p-6 text-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-medium">Langton's ant</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-white/50 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="text-sm leading-relaxed text-white/70">
          A simple set of rules produces surprisingly complex behavior. An ant sits on a grid.
          On a white cell, it turns right, flips the cell black, and steps forward. On a black
          cell, it turns left, flips the cell white, and steps forward. Left alone for a few
          hundred steps, it eventually builds a repeating diagonal "highway" out of what looked
          like chaos.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Drag to pan, scroll to zoom. Use the toolbar to place more ants or paint cells by hand
          before you press play.
        </p>
      </div>
    </div>
  );
}
