// Presentational only — no simulation or canvas logic in here.
// Props:
//   mode:            'pan' | 'place-ant' | 'paint'
//   onModeChange:    (mode) => void
//   colors:          array of hex strings, index = cell state (index 0 unused/empty)
//   selectedState:   number, the state the paint tool currently applies
//   onSelectColor:   (stateIndex) => void
const MODES = [
  { id: "pan", icon: "M13 6l6 6l-6 6M5 6l6 6l-6 6", label: "Pan" },
  { id: "place-ant", icon: "M12 2a4 4 0 100 8 4 4 0 000-8z", label: "Place ant" },
  { id: "paint", icon: "M3 21l3-3m0 0l9-9 3 3-9 9-3 0z", label: "Paint" },
  { id: "select-material", icon: "M3 21l3-3m0 0l9-9 3 3-9 9-3 0z", label: "Select Material" },
];

export default function Toolbar({ mode, onModeChange, colors, selectedColor, onSelectColor }) {
  return (
    <div className="pointer-events-auto absolute left-4 top-4 flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 p-1.5 backdrop-blur-sm">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          aria-label={m.label}
          title={m.label}
          onClick={() => onModeChange(m.id)}
          className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
            mode === m.id ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          <ModeIcon id={m.id} />
        </button>
      ))}

      {mode === "select-material" && (
        <>
          <div className="mx-1 h-5 w-px bg-white/15" />
          {colors.slice(1).map((color, i) => {
            const colorIndex = i + 1;
            return (
              <button
                key={colorIndex}
                type="button"
                aria-label={`Paint color ${colorIndex}`}
                onClick={() => onSelectColor(colorIndex)}
                className={`h-6 w-6 rounded-md border-2 transition-transform ${
                  selectedColor === colorIndex ? "scale-110 border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

function ModeIcon({ id }) {
  if (id === "pan") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M2 12h20" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "place-ant") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <circle cx="12" cy="12" r="5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21l3-3m0 0l9-9 3 3-9 9H6z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
