// Presentational only. Props: antCount, stepCount (numbers)
export default function StatsPanel({ antCount, stepCount }) {
  return (
    <div className="pointer-events-none absolute right-4 top-4 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-xs text-white/70 backdrop-blur-sm">
      <div className="flex justify-between gap-4">
        <span>Ants</span>
        <span className="font-medium text-white">{antCount}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span>Steps</span>
        <span className="font-medium text-white">{stepCount.toLocaleString()}</span>
      </div>
    </div>
  );
}
