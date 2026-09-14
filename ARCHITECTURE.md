# Architecture map

This file exists so a future session (human or AI) can find things without
re-reading the whole codebase. `app/app.js` and `app/style.css` used to be
single ~200KB/32KB files; they're now split into small, single-purpose files
under `app/js/` and `app/css/`, loaded via plain `<script>`/`<link>` tags in
`app/index.html` (no bundler, no build step — this still has to run from a
`file://` URL inside the packaged desktop app).

Skim the table below to find the right file before grepping the whole tree.

## JS files (`app/js/`, loaded in this order)

| # | File | Holds |
|---|------|-------|
| 01 | `data-core.js` | Palettes, mascots, lettering/pattern lists, difficulty levels, `GAME_IDS`, `GAME_CATALOG`, game name/label maps. Edit here to add/rename a game in the catalog. |
| 02 | `data-map.js` | `saCountries` (real South America path data traced from Wikimedia, huge single lines — rarely touched) and `countryFlag()`. |
| 03 | `data-southamerica.js` | Country facts, peaks, climb route, biomes, habitats, animals, market items/countries, timeline events, gaucho facts. Edit here to add facts/content. |
| 04 | `state.js` | `$`/`root`/`modalRoot` bootstrap, profile schema, `sanitize*`/migration, `save`/`current`, theming (`theme`/`contrast`/`shade`). |
| 05 | `audio.js` | Web Audio tones (`tone`, `fanfare`, `moo`), `speakText` (speech synthesis read-aloud), `audioSync`, `unlockAudio`. Add new sound effects here. |
| 06 | `celebration.js` | Shared confetti/fireworks/lasers/fountain celebration overlay used by several games. |
| 07 | `art-common.js` | `icon()` (UI icon set), `brand()`, `mascot()`, `mouseArt()`. |
| 08 | `ui-shell.js` | Topbar, footer, page shell, toast, modal dialog primitives. |
| 09 | `ui-workshop.js` | "Make it yours" personalization screen. |
| 10 | `ui-settings.js` | Settings screen. |
| 11 | `ui-parent.js` | Parent PIN gate, per-child game/difficulty toggles, assignments. |
| 12 | `ui-home.js` | Playroom home screen, game cards, School tab, onboarding, new-profile creation. |
| 13 | `game-flowers.js` | Bloom!/Bouquet!: flower art, vases, and `classicField` (the 3×3 target grid also used by Bop!). |
| 14 | `game-scurry.js` | Procedural maze generation and play. |
| 15 | `game-countries.js` | Country Match!: place countries on the real map. |
| 16 | `game-gauchos.js` | Gaucho Herd!: wandering cows, corral. Cow sound (`moo()`) is called from `herdClickCow`. |
| 17 | `game-peaks.js` | Peak Climber!: route up a real peak, summit photo/fact. |
| 18 | `game-biomes.js` | Wild Places!: place regions on the real map. |
| 19 | `game-animals.js` | Animal Sort!: sort animals into habitats. |
| 20 | `game-market.js` | Market Day!: count coins to pay an exact price. |
| 21 | `game-timeline.js` | Time Traveler!: order historical events. |
| 22 | `game-engine.js` | Generic engine: `startGame`, `renderGame`, the per-frame `tick`, `hit`, pause/resume/finish, difficulty. The `bodies`/`prompt`/`tips` dispatch maps in `renderGame` are how a game's view function gets wired in. |
| 23 | `main.js` | `render()` dispatcher, all pointer/click/keyboard event wiring, page lifecycle (visibility/blur/beforeunload). **Loads last** — everything else must already be defined by the time its click handler and final `render()` call run. |

### Why the load order mostly doesn't matter

These are classic (non-module) scripts sharing one global scope, so a
`function` or `var` in file 20 can freely call one declared in file 5 — name
resolution happens when the function *runs* (after every file has loaded),
not when it's declared. Only two things actually depend on order:
- `04-state.js` reads `GAME_IDS.slice()` at the top level, so `01-data-core.js`
  must load first.
- `23-main.js` wires up the real event listeners and calls `render()` at the
  very end, so it must load last.

### Naming gotcha

The app's navigation variable is `uiScreen`, not `screen` — it was renamed
during the 2026-09 file split because a **global** `var screen` collides with
the browser's built-in (non-configurable) `window.screen`. Removing the old
single-IIFE wrapper made this a real global, so don't reintroduce a top-level
`var screen`, `name`, `top`, `location`, `history`, `navigator`, `status`,
`self`, `parent`, or `frames` — those are all live `window` properties.

## CSS files (`app/css/`, order doesn't matter — no cross-file overrides)

| File | Covers |
|------|--------|
| `base.css` | Reset, design tokens (`:root`), topbar, generic buttons/panels/page-head, toast, a11y helpers. |
| `home.css` | Hero, game cards, School tab. |
| `onboarding.css` | First-run welcome screen. |
| `workshop.css` | "Make it yours" screen. |
| `settings.css` | Settings screen. |
| `dialogs.css` | Modal dialogs (player picker, parent PIN, add profile). |
| `game-shell.css` | Shared in-game chrome: header, scoreboard, playfield, pause, difficulty pills, fact banner. |
| `fx.css` | Shared celebration effects (confetti/fireworks/lasers/fountain). |
| `game-classic.css` | Bop!/Bloom!/Bouquet!: target grid, flowers, vases. |
| `game-scurry.css` | Maze. |
| `game-southamerica.css` | Shared map styling for Country Match! and Wild Places!. |
| `game-gauchos.css` | Gaucho Herd!. |
| `game-peaks.css` | Peak Climber!. |
| `game-newgames.css` | Animal Sort!, Market Day!, Time Traveler!. |

## The "fact audio" pattern

Every game that teaches a fact follows the same convention, so there's one
shared replay handler (`speak-fact` in `23-main.js`) instead of one per game:

1. The moment a fact becomes the "current" one (a country/biome is selected,
   a round starts, an animal is sorted correctly, a peak is summited), set
   **`game.fact`** to that text and call `speakText(game.fact)` right there —
   that's the auto-play-once-per-reveal part.
2. Render a `<div class="fact-banner"><button class="icon-button"
   data-action="speak-fact">...</button><p>...</p></div>` (CSS already in
   `game-shell.css`). The shared handler in `main.js` just does
   `speakText(game.fact)` again — that's the click-to-replay part.
3. Store the fact on the game's own sub-state too if it needs to survive a
   re-render without changing (e.g. `game.climb.fact`) — **never recompute a
   random fact inside a `*View()` render function**, since that function can
   run more than once for the same moment (e.g. opening Settings and going
   back re-renders the current screen). This was a real bug in Peak Climber!
   (fixed 2026-09-13): the summit fact was re-rolled on every render and the
   replay button read `game.fact`, which was never actually set.

Games without an educational fact (Bop!, Bloom!, Scurry!, Bouquet!, Market
Day!, Time Traveler!) don't need any of this.

## Adding a new game, end to end

1. Data → a `data-*.js` file (or a new one).
2. Icons/art + round logic (`new*Round`, `*View`, click handler) → a new
   `NN-game-<name>.js`, numbered after the last game file, before
   `game-engine.js`.
3. Wire it into `game-engine.js`: `startGame()`'s type dispatch, and
   `renderGame()`'s `prompt`/`bodies`/`tips` maps.
4. Wire it into `main.js`: the click-handler `else if(a===...)` chain, and
   add the type to the keydown guard's game-type exclusion list if it
   doesn't use the classic 3×3 keyboard grid.
5. Add it to `GAME_IDS` and `GAME_CATALOG` in `data-core.js`, plus a card
   scene in `ui-home.js`'s `scene()`.
6. New CSS → a new `game-*.css` file plus a `<link>` in `index.html`.
7. Test in the browser preview (`python3 -m http.server 8765 --directory app`),
   then update `tests/browser.cjs` (never actually executable in this
   environment — no Node/Playwright — so flag it as unverified).
