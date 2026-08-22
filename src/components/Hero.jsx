// Repurposed from the main site's Hero.jsx. Instead of sitting at the
// top of a scrolling page, it's now a full-screen splash that the
// visitor dismisses once, before the canvas becomes interactive.
// Props: onStart: () => void
export default function Hero({ onStart }) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="max-w-md px-6 text-center text-white">
        <h1 className="text-3xl font-medium">Langton's ant</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          A minimal simulation that turns a few lines of rules into emergent, unpredictable
          patterns. Place ants, paint the board, and watch it unfold.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90"
        >
          Start
        </button>
      </div>
    </div>
  );
}
