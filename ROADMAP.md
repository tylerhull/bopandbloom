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
| **Beginning Sounds** | `[done]` | M | words start with sounds | `36-game-begin.js` — hear a letter, tap the pack picture that starts with it (pack-driven) | existing pack pictures + letter-prompt audio |
| **Sound It Out** (CVC blending) | `[done]` | L | reading | `37-game-sound.js` — a CVC word as letter tiles; tap each to light it, tap "Say the word" to blend, Next | `CVC_WORDS` + word audio (word-focused; isolated-phoneme audio is a possible later refinement) |
| **Rhyme Time** (word families) | `[done]` | M | -at/-an/-ig patterns | `38-game-rhyme.js` — hear a word, tap the word that rhymes | `RHYME_FAMILIES` + word audio |
| **Sight Words** | `[done]` | M | the/was/said (unsoundable) | `39-game-sight.js` — hear a word, tap it | `SIGHT_WORDS` + word audio |

All four are **silent until the Polly run**. Word/letter lists are
single-sourced in `tools/phonics/build_phonics.py`, which generates both
`app/js/04c-data-phonics.js` and `tools/audio/phonics_manifest.csv` (115
clips under `app/audio/phonics/`); `build_audio_map.py` now reads that
manifest too. Decision: no new picture assets — these are letter/word +
audio based (Beginning Sounds reuses pack pictures), sidestepping emoji-font
and image-sourcing risk.

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

### Next batch — buildable now (no audio dependency)

Agreed 2026-10-02 (build all of these). Add any spoken text to the Polly CSV as each is built.

| Game | Status | Effort | What it is | Reuses |
|---|---|---|---|---|
| **Build the Word** | `[planned]` | M | spell a pack picture's name by tapping letter tiles; difficulty = show word → blanks → no help. **Pack-driven** (spells any pack item's label) | `activePackItems()`; optional spoken label via `speakText` |
| **Count It!** | `[planned]` | S | "how many?" — tap-count objects, pick the number | shape/art primitives |
| **Add & Take** | `[planned]` | M | simple picture addition/subtraction; size by difficulty | Count It! pieces |
| **More or Less** | `[planned]` | S | compare two groups, tap the bigger/smaller | shape/art primitives |
| **Number Order** | `[planned]` | S | put numbers in order / what-comes-next | Pattern Play! mechanic |

### Needs audio (schedule with Phase 0 Polly run)

| Game | Status | Effort | What it is | Reuses |
|---|---|---|---|---|
| **Spot-the-difference / Find-it** | `[idea]` | M | "find the toucan" on a scene; listening + vocabulary | existing art/photos |

---

## Phase 3 — Homeschool features

Build on the existing Parent Area (assignments, points, per-game/difficulty toggles).

| Feature | Status | Effort | What it is |
|---|---|---|---|
| **Progress reports + records** | `[done]` | L | `14b-ui-reports.js`: every finished game logs a session (`profile.activityLog` in `05-state.js`); Parent Area → "View progress" shows interactive SVG charts (sessions/day, time by area), stat cards, recent sessions, 7/30/90-day ranges. **Save records (CSV)** writes to a chosen location (Electron `records:save` dialog, or a browser download fallback) and **Print / Save as PDF**. Valuable for KY/TN/IN-style attendance + progress records — kept flexible, not a state-specific form. |
| **Auto-save to a cloud sync folder** | `[done]` | M | No backend by design. Parent picks a folder once (Electron `records:folder`); after **every finished game** the app appends new sessions to a per-child CSV there (`records:append`, append-only + per-profile `lastRecordSync` watermark so the file keeps full history with no duplicates). Point it at a Dropbox/Google Drive sync folder → records reach the cloud automatically, no manual upload. In-app activity log is a rolling window (cap 20,000/child); the folder file is the long-term store. Direct **OAuth** to Drive/Dropbox stays a deferred, credential-gated option if one-click upload is ever wanted. |
| **Guided reading path** | `[planned]` | M | pre-sequenced assignments that walk a child through the phonics collection in order — no hand-built curriculum needed |
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
| **Auto-update** | `[done]` | M | `electron-updater` against GitHub Releases (`build.publish` in `package.json`; publish with `npm run release` + a `GH_TOKEN`). `electron/main.js` checks on launch + every 6h, auto-downloads, and pushes status to the renderer (`window.bopUpdate`); Settings → "App updates" shows status + **Install & restart** when ready, and a toast notifies the parent. **User data is preserved automatically** — profiles/settings/packs live in `app.getPath('userData')`, which updates never touch (appId/productName are stable). **Requires signing to actually auto-update on macOS** (ties to the notarization row). Not runnable in the dev sandbox — verified the renderer flow via a mocked bridge; needs a real two-build smoke test. |
| **Back up / restore all data** | `[done]` | S | Belt-and-suspenders for the data-safety worry: Parent Area → "Save a backup" writes the full app state to a JSON file (Electron save dialog or browser download — stash it in a Dropbox/Drive folder), and "Restore from backup" (Electron) reads one back after validating it. `backupData`/`restoreData` in `05-state.js`. |

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
