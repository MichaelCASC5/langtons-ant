// Presentational modal, reusing the same overlay pattern as
// ProjectModal.jsx in the main site template. Props: open, onClose
import { Link } from "react-router-dom";
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
          <h2 className="text-base font-medium">Information</h2>
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
          Each circle continually produces neutral Langton's ants. These ants become dedicated
          to whatever color they first encounter; they build that material for the rest of
          their lives. An ant can "capture" a circle by causing the new ants to fall onto its
          own color.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Use the toolbar to place more ants or paint cells by hand.
          The first color in the palette is actually the "neutral" color.
        </p>

        <p className="mt-3 text-sm leading-relaxed text-white/70">
          <small>
            contact: <a href="mailto:michaelcalle14@gmail.com">michaelcalle14@gmail.com</a>
          </small>
        </p>
        
      </div>
    </div>
  );
}
