# Langton's Ant War

An interactive, full-bleed 2D simulation of [Langton's ants](https://en.wikipedia.org/wiki/Langton%27s_ant) cellular automata fighting for resources and territory.

**[Live demo →](https://ants.michaelcalle.com)**

## What is Langton's Ant?

An ant sits on an infinite grid of cells. At each step:

- On a cell in one state, it turns one way, flips the cell to the next state, and moves forward.
- On a cell in another state, it turns the other way, flips the cell, and moves forward.

That's the entire rule. Run it for a few hundred steps and the ant's path looks like noise, but it eventually locks into a repeating diagonal pattern called a "highway" and marches off in a line forever. This project lets you place multiple ants, paint the board by hand, and watch that behavior unfold in real time.

## Features

- **Multiple ants** — place as many as you like; they all share and compete over the same grid
- **Custom start colors** — an ant can start committed to a color, or start "neutral" and lock onto the first color it touches
- **Freehand painting** — draw static colored cells directly onto the board before or during a run
- **Custom rules** — the classic two-state rule (`RL`) or extended multi-state rules (e.g. `RLLR`) for more complex behavior
- **Pan & zoom** — click-and-drag or one-finger-drag to pan, scroll wheel or two-finger pinch to zoom
- **Fullscreen mode** — the simulation is designed to fill the entire viewport
- **Adjustable simulation speed** — from single-stepping to many steps per frame

## Controls

| Action | Desktop | Mobile |
|---|---|---|
| Pan | Click and drag (Pan mode) | One-finger drag |
| Zoom | Scroll wheel | Two-finger pinch |
| Place an ant | Click (Place Ant mode) | Tap |
| Paint a cell | Click and drag (Paint mode) | Tap and drag |
| Play / pause | Control panel button | Control panel button |
| Fullscreen | Toolbar button | Toolbar button |

## Tech stack

- [React](https://react.dev/) — UI layer only; the simulation itself is plain JavaScript
- [Vite](https://vitejs.dev/) — build tooling and dev server
- [Tailwind CSS](https://tailwindcss.com/) (v3) — styling
- [React Router](https://reactrouter.com/) — routing
- Deployed on [Vercel](https://vercel.com/)

No TypeScript, no simulation-related dependencies.

## How it's built

The simulation engine (`src/engine/`) is deliberately kept separate from React:

```
src/
├─ engine/          Plain JS — no React. Grid state, ant movement, rule
│                    parsing, camera (pan/zoom) math, and canvas rendering.
│                    Mutated directly every frame; never touches React state.
├─ hooks/            The glue layer between the engine and React:
│                       useSimulation          owns the animation-frame loop
│                       useCanvasInteraction   pointer, wheel, and touch input
│                       useFullscreen          wraps the Fullscreen API
├─ components/       Presentational UI: toolbar, playback controls, stats,
│                    settings and info modals
├─ layouts/          Page-level layout shell
└─ pages/            Composes engine + hooks + components into the app
```

Simulation state (the grid, every ant's position) lives in refs and is mutated directly on each animation frame — putting it in React state would mean a re-render on every simulation tick, which is far too slow for smooth panning, painting, and zooming. A handful of display values (step count, ant count) are mirrored into React state a few times a second, just enough to keep the stats panel current.

## Getting started

```bash
git clone https://github.com/MichaelCASC5/langtons-ant.git
cd langtons-ant
npm install
npm run dev
```

Then open the printed local URL in your browser.

To test on a real phone during development (recommended — desktop "mobile view" doesn't accurately simulate touch gestures or mobile browser chrome):

```bash
npm run dev -- --host
```

and open the printed network URL on a phone connected to the same Wi-Fi.

## Building for production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally with:

```bash
npm run preview
```

## Deployment

This project deploys independently of [michaelcalle.com](https://michaelcalle.com) as its own Vercel project, exposed at the `ants.michaelcalle.com` subdomain. It has no shared build pipeline or dependency with the main site.

## Roadmap

- [ ] Persist simulation state across page reloads
- [ ] Export the current board as an image
- [ ] Additional preset rules beyond the classic and a few hand-picked extended ones
