# Langton's Ant

A full-bleed, interactive Langton's Ant simulation. React + Vite + Tailwind v3, no
TypeScript — matches your michaelcalle.com stack.

## Running it standalone

```
npm install
npm run dev
```

## How this maps onto your existing template

```
src/
├─ engine/            NEW — plain JS, zero React. This is the simulation itself:
│                      grid state, ant movement, the rule parser, the camera
│                      (pan/zoom math), and the canvas renderer. Nothing here
│                      re-renders React; it's mutated directly every frame.
├─ hooks/              NEW — the glue between engine and React:
│    useSimulation      owns the requestAnimationFrame loop and exposes
│                        play/pause/step/reset/etc as stable functions
│    useCanvasInteraction  translates pointer + wheel events into engine calls
│    useFullscreen      wraps the real browser Fullscreen API
├─ components/
│    Hero.jsx            repurposed from your template: now a dismissible
│                         full-screen splash instead of page-top content
│    ProjectModal.jsx → became InfoModal.jsx + CanvasSettingsModal.jsx
│                         (same overlay pattern, split into "what is this"
│                         and "simulation settings")
│    SimulationCanvas.jsx  NEW — the canvas element itself
│    Toolbar.jsx           NEW — floating mode switcher + color palette
│    ControlPanel.jsx      NEW — floating playback controls
│    StatsPanel.jsx        NEW — floating ant/step counter
├─ layouts/
│    MainLayout.jsx      trimmed down: no nav/footer, just a full-viewport
│                         container, since every pixel goes to the canvas
├─ pages/
│    Home.jsx            composes everything above; owns only UI-level state
│                         (active tool, which modal is open) — never
│                         simulation state
└─ App.jsx               same role as your template's App.jsx
```

## Deploying

Recommended: push this as its own repo, deploy it as its own Vercel project,
then point a subdomain (e.g. `ant.michaelcalle.com`) at it from that project's
Settings → Domains. See the conversation this came from for the full walkthrough —
your main site's repo and deploy pipeline don't need to change at all.

## Where to go next

- **Rule editor UX**: right now the rule is a raw text field ("RL", "RLLR", etc.)
  in the settings modal. You could validate it live and preview the color palette
  for each state.
- **Persisting a session**: nothing is saved right now — refreshing clears the
  board. Not hard to add (serialize the grid Map + ants array to localStorage),
  intentionally left out for now to keep the first version simple.
- **Touch support**: pointer events already cover touch, but a phone-sized
  screen with this many floating panels will feel cramped — worth a pass once
  the desktop experience feels done.
