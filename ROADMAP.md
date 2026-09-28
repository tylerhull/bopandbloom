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
| **Letter / Number Tracing** | `[next]` | M | draw the shape with finger/mouse; letter formation + fine motor | — (new canvas/SVG path drawing) |
| **Shape & Color Sorting** | `[idea]` | S | drag shapes to bins; pure toddler game for the 3-yo | existing art primitives |
| **Simple Patterns** | `[idea]` | S | "what comes next?" (red, blue, red, ?); early reasoning | existing art primitives |
| **Memory / Matching Pairs** | `[idea]` | S | flip cards to match animal↔animal or animal↔name | existing photos; name version = early word recognition |
| **Flag Match** | `[idea]` | S | match flags to countries | existing `countryFlag()` + country data — nearly free |

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
| **Home-screen collection grouping** | `[planned]` | M | group games into "Reading," "South America," "Numbers" — turns the game list into visible collections, keeps it navigable as it grows |
| **Stickers / reward collection** | `[idea]` | M | earn a sticker per finished game, shown on a "my collection" page; big motivator, ties into points |
| **"Read to me" everywhere** | `[idea]` | M | tap-to-hear on any on-screen text (not just facts) so pre-readers can navigate solo. *Needs Phase 0 audio.* |
| **Daily "pick 3"** | `[idea]` | S | rotating small set on the home screen so the list isn't overwhelming for a little kid |

---

## Dev efficiency & structure

The big win (splitting `app.js`/`style.css` into small files) is done. These
reduce ongoing per-edit token cost and drift.

| Item | Status | Effort | Why | Payoff |
|---|---|---|---|---|
| **Generate the `<script>`/`<link>` block + cache-buster** | `[planned]` | S | Every CSS/JS edit currently forces rewriting all ~41 `?v=N` tags in `index.html`. A tiny script would stamp the buster from `APP_VERSION` (or a file hash) so a change touches **one** place. | **Highest** — pays back on every future edit |
| **Single source for the version** | `[planned]` | S | `build-deb.sh` has its own `Version:` that can drift from `APP_VERSION`; have the build read the constant. | Prevents mismatched version numbers |
| **Per-file header index line** | `[idea]` | S | one comment line per file listing what it owns, so exploration reads less. | Minor, cheap |

---

## Suggested build order

1. **User:** kick off Phase 0 audio generation now (unblocks all reading games).
2. **Dev, in parallel:** dev-efficiency #1 + #2 (cheap, make everything after cheaper), then **Letter/Number Tracing** (real value, no audio).
3. Once audio plays: **Beginning Sounds** → **Sound It Out** → **Rhyme Time** → **Sight Words**.
4. Fill in the easy no-audio games (Flag Match, Memory, Shapes, Patterns) as quick wins between bigger items.
5. **Homeschool features** (reading path + progress report), then **home-screen grouping** to tie the collections together.
6. Engagement polish (stickers, daily pick 3, read-to-me) last.
