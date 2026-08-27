// Presentational modal. Props:
//   open, onClose
//   rule, onRuleChange: the turn-rule string, e.g. "RL" or "RLLR"
//   border, onBorderChange: border dimension
//   loopBorder, onLoopBorderChange: whether ants wrap at the border
//   antSpawnRate, onAntSpawnRateChange
//   spawnerSpawnRate, onSpawnerSpawnRateChange
//   spawnerMove, onSpawnerMoveChange
//   colorSpawn, onColorSpawnChange
export default function CanvasSettingsModal({
  open,
  onClose,
  rule,
  onRuleChange,
  loopBorder,
  onLoopBorderChange,
  border,
  onBorderChange,
  antSpawnRate,
  onAntSpawnRateChange,
  spawnerSpawnRate,
  onSpawnerSpawnRateChange,
  spawnerMove,
  onSpawnerMoveChange,
  colorSpawn,
  onColorSpawnChange,
}) {
  if (!open) return null;

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-80 overflow-y-auto rounded-xl border border-white/10 bg-neutral-900 text-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-neutral-900/95 px-5 py-3.5 backdrop-blur-sm">
          <h2 className="text-sm font-medium">Settings</h2>
          <button
            type="button"
            aria-label="Close settings"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 px-5 py-5">
          <Section title="Rule">
            <Field label="Turn rule">
              <TextInput value={rule} onChange={onRuleChange} placeholder="RL" />
            </Field>
            <Hint>"RL" is the classic ant. Longer rules like "RLLR" add more behaviors.</Hint>
          </Section>

          <Section title="Space">
            <Field label="Border dimension">
              <TextInput value={border} onChange={onBorderChange} placeholder="Insert border" />
            </Field>
            <Toggle label="Edge wrapping" checked={loopBorder} onChange={onLoopBorderChange} />
            <Hint>Only affects ants.</Hint>
          </Section>

          <Section title="Population">
            <Field label="Ant spawn rate %">
              <NumberInput value={antSpawnRate} onChange={onAntSpawnRateChange} placeholder="1.0" />
            </Field>
            <Field label="Spawner spawn rate %">
              <NumberInput value={spawnerSpawnRate} onChange={onSpawnerSpawnRateChange} placeholder="1.0" />
            </Field>
            <Hint>Set to 0 for a blank canvas.</Hint>
            <Toggle label="Spawners move" checked={spawnerMove} onChange={onSpawnerMoveChange} />
          </Section>

          <Section title="Color">
            <Field label="Amount of colors to spawn">
              <NumberInput value={colorSpawn} onChange={onColorSpawnChange} placeholder="1.0" />
            </Field>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-white/40">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-xs text-white/60">
      <span className="block pb-1">{label}</span>
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-white/15 bg-black/40 px-2.5 py-1.5 text-sm text-white outline-none transition-colors focus:border-white/40"
    />
  );
}

function NumberInput({ value, onChange, placeholder }) {
  return (
    <input
      type="number"
      step="any"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-white/15 bg-black/40 px-2.5 py-1.5 text-sm text-white outline-none transition-colors focus:border-white/40"
    />
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-xs text-white/60">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-white"
      />
    </label>
  );
}

function Hint({ children }) {
  return <p className="text-[11px] leading-relaxed text-white/40">{children}</p>;
}
