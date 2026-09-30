# Bop & Bloom — Roadmap

Forward-looking plan for games, features, and dev-workflow improvements.
Read `ARCHITECTURE.md` first for how any of this actually gets built (file
map, the fact-audio pattern, the `img-fallback` photo pattern, the SVG
viewBox gotcha, etc.). This file is the *what/why/order*; ARCHITECTURE.md
is the *how*.

**Status legend:** `[done]` shipped · `[next]` teed up · `[planned]` agreed, not started · `[idea]` captured, not scheduled

**Effort:** S = an afternoon · M = a day or two · L = multi-session

---

## Recently done

- `[done]` **Version number in Settings** — `APP_VERSION` constant in `01-data-core.js`, shown at the bottom of the Settings screen (`v0.1.0`). Single place to bump.
- `[done]` **South America map clipping fix** — corrected the SVG `viewBox` to actually bound the path data (see ARCHITECTURE.md).

---

## Phase 0 — Audio foundation (prerequisite for sound-based games)

Almost every reading game depends on the child *hearing* sounds/words, and
`app/audio/` is currently empty. Nothing sound-based is truly "done" until
Polly clips exist and play. **Can run in parallel with any no-audio game
below** — don't block build work on it.

| Item | Status | Effort | Notes |
|---|---|---|---|
| Generate Polly clips (`generate_polly_audio.py`) | `[next]` | S | **User's side** — needs AWS creds + `python3-boto3`. Populates `app/audio/<game>/`. |
| Verify playback end-to-end in real WebKitGTK | `[next]` | S | Confirm actual `<audio>` playback, not just that `speakText` is called. |
| Make "add a clip for a new game" a clean one-step flow | `[planned]` | S | Add CSV rows → `build_audio_map.py` → regenerate. Document in ARCHITECTURE.md. |

---

## Phase 1 — "Learn to Read" collection (phonics progression)

A pedagogically ordered path: letter → sound → blend → pattern → whole word.
`Letter Sounds!` (letter→sound) already exists; these fill the gaps.

| Game | Status | Effort | Teaches | How it works | Needs |
|---|---|---|---|---|---|
| **Beginning Sounds** | `[planned]` | M | words start with sounds | see a photo, hear the word, tap the starting letter | *reuses* the 30 South American animal photos — cheapest to build |
| **Sound It Out** (CVC blending) | `[planned]` | L | actually reading | show `c a t` + picture, tap each letter for its sound, tap word to blend | ~30 CVC words + simple pictures + audio (letter sounds + blended word) |
| **Rhyme Time** (word families) | `[planned]` | M | -at/-an/-ig patterns | match words that rhyme | word-family sets + pictures + audio |
| **Sight Words** | `[planned]` | M | the/was/said (unsoundable) | flash card + "tap the word you hear" | ~40 word list + audio |

Open decision: CVC/rhyme pictures — reuse simple SVG icons (clearer for
little kids, no sourcing) vs. real photos (more work, needs Wikimedia +
license checks). Lean icons for these.

---

## Phase 2 — More games

### Buildable now (no audio dependency)

| Game | Status | Effort | What it is | Reuses |
|---|---|---|---|---|
| **Letter / Number Tracing** | `[done]` | M | Trace It! (`25-game-trace.js`) — draw big glyphs on a canvas; ABC/abc/123 toggles; no audio, no timer | new canvas drawing |
| **Shape & Color Sorting** | `[done]` | S | Shape Sort! (`28-game-shapes.js`) — tap the bin a shape belongs in; rounds alternate by-shape / by-color; no audio/timer | new `shapeArt()` |
| **Simple Patterns** | `[done]` | S | Pattern Play! (`29-game-patterns.js`) — tap what comes next in a repeating shape/color pattern; difficulty sets unit size 2/3/4; no audio/timer | reuses `shapeArt()` |
| **Memory / Matching Pairs** | `[done]` | S | Memory Match! (`27-game-memory.js`) — flip cards to match animal-photo pairs; Easy/Medium/Hard = 3/6/8 pairs; no audio/timer | `letterAnimals` photos |
| **Flag Match** | `[done]` | S | Flag Match! (`26-game-flags.js`) — hear/read a country, tap its flag; Easy/Medium/Hard = 3/4/6 choices | `countryFlag()` + `saCountries` names; country names added to audio CSV |

### Needs audio (schedule after Phase 0)

| Game | Status | Effort | What it is | Reuses |
|---|---|---|---|---|
| **Counting game** | `[idea]` | M | count-and-tap / simple addition; rounds out early math | Market Day! patterns |
| **Spot-the-difference / Find-it** | `[idea]` | M | "find the toucan" on a scene; listening + vocabulary | existing art/photos |

---

## Phase 3 — Homeschool features

Build on the existing Parent Area (assignments, points, per-game/difficulty toggles).

| Feature | Status | Effort | What it is |
|---|---|---|---|
| **Guided reading path** | `[planned]` | M | pre-sequenced assignments that walk a child through the phonics collection in order — no hand-built curriculum needed |
| **Printable progress report** | `[planned]` | M | per-child mastery record (useful for portfolios/reviews) |
| **Printable worksheets** | `[idea]` | L | offline tracing/matching pages that mirror the games |

---

## Phase 4 — Engagement & UX

| Feature | Status | Effort | What it is |
|---|---|---|---|
| **Home-screen collection grouping** | `[done]` | M | Play tab now groups games into Playroom / Explore South America / Letters, numbers & thinking via `GAME_GROUPS` in `data-core.js` (with a "More games" catch-all) |
| **Stickers / reward collection** | `[idea]` | M | earn a sticker per finished game, shown on a "my collection" page; big motivator, ties into points |
| **"Read to me" everywhere** | `[idea]` | M | tap-to-hear on any on-screen text (not just facts) so pre-readers can navigate solo. *Needs Phase 0 audio.* |
| **Daily "pick 3"** | `[idea]` | S | rotating small set on the home screen so the list isn't overwhelming for a little kid |

---

## Phase 5 — Release readiness (v1.0, before the first public users)

Goal: ship a downloadable app for **Windows, Mac, and Linux** aimed at
homeschool families. **Everything in this phase is a pre-release
requirement** — the target audience is the general public, not just the
maintainer's family. Decisions recorded 2026-09-29.

### Cross-platform packaging — Electron

| Item | Status | Effort | Notes |
|---|---|---|---|
| **Wrap the existing web app in Electron** | `[done]` | M | `electron/main.js` + `package.json` load `app/index.html` in a locked-down window (`nodeIntegration:false`, `contextIsolation:true`, `sandbox:true`); `localStorage` persistence carries over. Not launchable in the dev sandbox (no Node) — verify with `npm start`. |
| **`electron-builder` producing all installers** | `[done]` | M | `build` config in `package.json` → `.exe` (Windows), `.dmg` (Mac), `.AppImage` + `.deb` (Linux) via `npm run dist`. Icons go in `build/` (see `build/README.md`). GTK `launcher.py`/`build-deb.sh` path kept in parallel. Not buildable in the dev sandbox — run on a real machine. |
| **Mac notarization + Windows code signing** | `[planned]` | L | The real hard part of a public release, not the build. Mac: Apple Developer account ($99/yr) + notarization to clear Gatekeeper. Windows: code-signing cert to avoid SmartScreen warnings. Can ship unsigned as a stopgap (users click through warnings) but not ideal for a wide audience. |
| **Persistence review under Electron** | `[planned]` | S | `localStorage` works in Electron; confirm save/restore across app restarts, and decide whether to move to a real user-data file now that filesystem access is available (also unblocks pack imports below). |

Notes: the ES5 / no-modules / `file://` constraints existed only for old
Ubuntu WebKitGTK — under Electron they relax (no rewrite needed, but future
code may use modern JS). Pre-recorded Polly audio remains the right choice:
it sounds identical on every OS rather than depending on each platform's TTS.
**Photo licensing** matters more once public — the Wikimedia CC-BY / CC-BY-SA
credits (in-app + README) must stay; share-alike is fine for this use.

### Content packs

| Item | Status | Effort | Notes |
|---|---|---|---|
| **Pack data model** | `[done]` | M | `04b-data-packs.js`: `PACKS` registry + `activePackItems()`; item = `{id,label,image?,svg?,pt?,credit?}` (`speakText(label)` handles audio via `AUDIO_MAP`). Two **built-in** packs derived from existing data (South American Animals from `letterAnimals`; South American Flags from `saCountries`+`countryFlag`) — no duplication. Fuller content-out-of-code refactor can follow as new packs. |
| **Parent Tools: pack selection** | `[done]` | M | "Content packs" section in the Parent Area with on/off toggles per pack, stored as `profile.enabledPacks` (empty/absent = all), mirroring the "Games shown" toggles. |
| **Pack-driven games** | `[done]` | M | **Flashcards!** (`30-game-flash.js`), **Memory Match!**, and **Letter Sounds!** all draw from the child's enabled packs and render photo or flag-svg items. (The map/geography games, Animal Sort!, and the procedural games stay on their own content — packs don't fit them.) |
| **User-imported packs** | `[done]` | L | Parents add a `.bop` pack file in the Parent Area (Electron only): `electron/main.js` validates + stores it under `<userData>/packs/`, `preload.js` exposes `window.bopPacks`, `32-main.js` loads at startup. Imported packs are image-only (no markup). Authoring tool: `tools/packs/build_pack.py` builds a `.bop` from a folder of images. Not runnable in the dev sandbox (no Electron) — verified via a mocked bridge + the builder tool; needs a real-app smoke test. |

Suggested order for release: **Electron build first** (low-risk, unblocks
filesystem access and gives a shippable cross-platform download; do
notarization as a follow-up), **then the pack system** (built-in packs +
parent toggles + Flashcards, designed so imported packs slot in later).

---

## Dev efficiency & structure

The big win (splitting `app.js`/`style.css` into small files) is done. These
reduce ongoing per-edit token cost and drift.

| Item | Status | Effort | Why | Payoff |
|---|---|---|---|---|
| **Generate the `<script>`/`<link>` block + cache-buster** | `[done]` | S | `tools/build_index.py` stamps each asset with a `?v=<content-hash>` between `build:` markers in `index.html` — run it after editing js/css instead of hand-bumping ~41 tags. | **Highest** — pays back on every future edit |
| **Single source for the version** | `[done]` | S | `build-deb.sh` reads `APP_VERSION` from `01-data-core.js` for the .deb version + filename, and runs `build_index.py` before packaging. | Prevents mismatched version numbers |
| **Per-file header index line** | `[idea]` | S | one comment line per file listing what it owns, so exploration reads less. | Minor, cheap |

---

## Suggested build order

**Done:** dev-efficiency #1 + #2 · version number · the no-audio games
(Trace It!, Flag Match!, Memory Match!, Shape Sort!, Pattern Play!) ·
home-screen collection grouping.

**Remaining, roughly in order:**
1. **User:** run Phase 0 Polly audio generation (unblocks every read-aloud/phonics game).
2. Once audio plays: **Beginning Sounds** → **Sound It Out** → **Rhyme Time** → **Sight Words**; then **Counting** and **Spot-the-difference**.
3. **Homeschool features** (guided reading path + progress report).
4. Engagement polish (stickers, daily pick 3, read-to-me).

**Before the first public release (Phase 5 — all required):**
5. **Electron build** for Windows/Mac/Linux first (low-risk, unblocks filesystem access), then **Mac notarization / Windows signing** as a follow-up.
6. **Content packs**: refactor current content into built-in packs → parent-tools pack toggles → a **Flashcards** game; user-imported packs after that (easier on Electron).

Phase 5 doesn't strictly depend on finishing the phonics games, but the
maintainer wants the fuller game set, packs, and cross-platform build all in
place before onboarding the first outside users.
