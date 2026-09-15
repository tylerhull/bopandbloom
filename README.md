# Bop & Bloom

A personalized, offline Linux playroom for ages 3 and 5. Version 0.1.0.

## Install on Ubuntu

Download `bop-and-bloom_0.1.0_all.deb`. Open it with Ubuntu Software and choose Install. If your system does not offer a graphical installer, open a terminal in the folder containing the download and run:

```sh
sudo apt install ./bop-and-bloom_0.1.0_all.deb
```

Then find **Bop & Bloom** in the applications menu. The first launch asks for a name. Installation may need internet access to fetch Ubuntu dependencies; playing, personalization, and saving work completely offline afterward.

Ubuntu 18.04 should have its normal system updates installed. The package requires Python 3.6+, GTK 3, and WebKitGTK 2.22 or later through the `gir1.2-webkit2-4.0` package. Updated Ubuntu 18.04 provided WebKitGTK 2.32.4. Newer distributions may instead use `gir1.2-webkit2-4.1`. There are no bundled modern Electron, Node, or glibc requirements.

**Compatibility status:** designed and packaged for updated Ubuntu 18.04. Tested in Chromium and a native GTK 3 / WebKitGTK 4.1 desktop host on the available Linux environment. An actual Ubuntu 18.04 installation and end-to-end package installation have not yet been tested. Treat this as the first playable build, with that target-machine check still outstanding.

## Play

- **Bop!** Click or tap a friendly field mouse. It ducks back into its hole. No harm, no penalties.
- **Bloom!** Click or tap a growing flower to snip it. The flower grows back. Each snip adds one to the flower count; a very new shoot needs a moment to grow before it can be snipped again.
- **Scurry!** A brand-new maze is generated every round. On Easy, tap the one lit-up box next to the mouse, one step at a time — the original way this game played. Medium and Hard let you tap further down an open corridor to drop every cheese crumb in between in one click, and Hard adds a bigger maze and a 60-second timer. Tap an earlier crumb (or "Start this maze over") to back up — there is never a wrong-answer penalty. A trumpet fanfare and confetti celebrate each mouse getting home.
- **Bouquet!** A target bouquet appears in a vase graphic at the top of the garden, with each flower drawn with its stem and leaves just like the ones in the garden; snip the matching flower types and colors to fill a second vase to match, one flower blooming into place at a time. A non-matching flower just gives a gentle "not this one" wiggle — no penalty. Four flower species (daisy, tulip, sunflower, rose) across six colors, with a dark outline on every vase and petal so pale/white blooms and the vases themselves stay visible on any background.
- **Country Match!** Learn South America: pick a country from the list to hear a fact about it read aloud, then tap its place on a simplified map to fill it in. Medium and Hard add a 60-second timer, and Hard hides the "you're getting warm" highlight so it relies on memory alone.
- **Gaucho Herd!** Tap the cows wandering the Patagonian pampas to send them home to the corral, each with a happy little moo. Medium and Hard add more cows and a timer.
- **Peak Climber!** Tap your way up a route to the summit of a real Patagonian or Andean peak (Fitz Roy, Cerro Torre, Aconcagua, or Torres del Paine, picked at random each round). Reaching the top shows a real photo of the peak, its height, and a fact read aloud, then hands off to a fresh peak. Medium and Hard add a 60-second timer; Hard also hides the next-step hint.
- **Wild Places!** Pick a region — the Amazon, the Andes, the Atacama, the Pampas, Patagonia, the Gran Chaco — then tap where it belongs on the real map of South America. Each pick reads out a fact about that place. Medium and Hard add a 60-second timer; Hard drops the "you're getting warm" pulse.
- **Animal Sort!** Twelve South American animals wander in one at a time; send each one home to the right habitat, and hear a fact read aloud for every correct sort. Easy uses three habitats with names; Hard adds Coast & Sea and hides the names, so the pictures are the only clue.
- **Market Day!** Count out coins to pay exactly the right price for a treat at a market in Argentina, Brazil, Peru, Colombia, or Chile. Easy uses only 1-coins and small prices, Medium adds 2-coins, Hard adds 5-coins and bigger prices. Overpaying just resets the coins with a friendly nudge — no penalty.
- **Time Traveler!** Order big moments in South American history, oldest first, from the Inca Empire to the building of Brasília. Easy shows three cards with their years; Hard shows four and hides the years.
- **Letter Sounds!** A real photo of a South American animal — a jaguar, an alpaca, a toucan, a hummingbird, and 26 more — with its name read aloud. Tap the letter it starts with from a row of choices. Easy offers 3 choices, Medium 4, Hard 6 with some easily-confused letters (like B/D/P) mixed in on purpose, plus a 60-second timer.
- Wherever a game shows a fact or a name to learn (Country Match!, Gaucho Herd!, Peak Climber!, Wild Places!, Animal Sort!, Letter Sounds!), it's read aloud automatically the first time, with a speaker icon next to it to hear it again any time.
- **Easy, Medium, and Hard** are chosen separately for each game, right on that game's own screen, and each game remembers its own choice. Easy has no timer and is the original, gentlest version of each game. Medium and Hard add a 60-second timer (except Scurry's corridor shortcuts, which don't need one) and a bit more challenge — never a point penalty for missing.
- Choose **All done**, or the home button mid-round, to head straight back to the playroom — no extra confirmation step.
- Keyboard: `Q W E / A S D / Z X C` or `1–9` map to the nine targets in Bop!/Bloom!/Bouquet!; arrow keys or WASD move the mouse in Scurry!. Space or Escape pauses/resumes. F11 toggles fullscreen in the desktop app. Tab and Enter work on menu controls.

## Make it theirs

Choose **Make it yours** in the playroom. Edit the name, choose one of sixteen sidekicks, eight lettering styles, and five playroom patterns (including a plain, solid option for a clean branded look), then apply one of thirteen quick palettes or fine-tune all six colors individually. **Surprise me!** generates another combination of palette, sidekick, lettering, and pattern. These are local procedural combinations, not cloud AI image generation. **Save my style** applies the preview.

The child's name becomes the main identity. The fixed Bop & Bloom icon and small wordmark remain consistent.

Use the player button at the top to add or switch between up to 24 local profiles. Each remembers its name, colors, sidekick, lettering, pattern, per-game difficulty choices, schoolwork, points, and timed best scores. The most recently selected player opens next time. Players can share the same Linux login; separate Linux logins have separate profile sets. Profile deletion is not included in this first build.

Settings include master mute and volume, separate music and effects toggles and volumes, and less animation. Sound settings are shared between profiles on the same Linux login. Settings save automatically; opening settings during a game pauses the round and offers a return button.

## Parent area

Tap the lock icon in the top bar and enter the 4-digit parent PIN (**1234** by default — change it from inside the Parent area) to reach grown-up controls:

- **Games shown** — turn any game on or off per child, so the playroom menu only shows what's appropriate for them right now.
- **Difficulty levels shown** — turn Easy/Medium/Hard on or off per child; whatever stays on is what that child can choose from on each game's own screen. At least one game and one difficulty level always stay on.
- **Assign schoolwork** — pick a game and assign it to a child. It shows up under the **School** tab on their playroom menu (next to **Play**), with a badge for how many assignments are waiting.
- **Review completed work** — every finished assignment records the date, the score, and the points earned (10 points plus the score achieved) for the parent to look back on.

Children see their running point total and a list of finished assignments right on their own **School** tab, so they get the satisfaction of seeing progress without needing the PIN.

## Data and privacy

No accounts, ads, analytics, remote fonts, external assets, or network calls. Names stay on the computer.

Profiles are saved atomically to:

```text
~/.local/share/bop-and-bloom/profiles.json
```

If `XDG_DATA_HOME` is set to an absolute path, that location replaces `~/.local/share`. Back up the profile file to transfer playrooms to another computer. Uninstalling the package does not delete profiles. A corrupt profile file is preserved as `profiles.recovery.json` when possible.

The browser preview uses browser local storage and is separate from the installed app's profiles.

## Source and development

- `app/`: HTML, CSS, JavaScript, and original vector icon. `app/js/` and `app/css/` are split into small, single-purpose files (loaded via plain `<script>`/`<link>` tags, no bundler) — see [ARCHITECTURE.md](ARCHITECTURE.md) for the file map before diving in. Nearly all graphics and music are generated locally with no third-party downloads; the exceptions are licensed real photos, downloaded and resized from Wikimedia Commons — see "Photo and map credits" below. Read-aloud facts and names play from pre-recorded audio clips in `app/audio/`, generated offline with `espeak-ng` — not the browser's built-in speech synthesis (which isn't available in the packaged app's WebKitGTK build) and not a network service.
- `launcher.py`: Python 3.6-compatible GTK desktop host, native profile storage, and local-only navigation.
- `build-deb.sh`: builds an architecture-independent, gzip-compressed Debian package using `dpkg-deb`.
- `tests/`: native storage tests and browser integration tests.

### Photo and map credits

- Country Match! and Wild Places! trace their map borders from real geographic path data adapted from [South America-fr.svg](https://commons.wikimedia.org/wiki/File:South_America-fr.svg) (Sémhur, DavoO, Themightyquill, derived from Yug's South America-en.svg), CC BY-SA 3.0.
- Peak Climber!'s four summit photos: [Fitz Roy](https://commons.wikimedia.org/wiki/File:Fitz_Roy_framed_trees_(colour_balans).jpg) (Jenny Mealing, CC BY 2.0), [Cerro Torre](https://commons.wikimedia.org/wiki/File:Cerro_Torre_Sunset.jpg) (Masa Sakano, CC BY-SA 2.0), [Aconcagua](https://commons.wikimedia.org/wiki/File:Aconcagua_Provincial_Park_04.jpg) (Bernard Gagnon, CC BY-SA 4.0), and [Torres del Paine](https://commons.wikimedia.org/wiki/File:Towers_of_Paine_-_Torres_del_Paine_National_Park_13.jpg) (Snowmanstudios, CC BY-SA 4.0).
- Letter Sounds!'s 30 animal photos, all from Wikimedia Commons: Alpaca (Kyle Flood, CC BY-SA 2.0), Anaconda (Fernando Flores, CC BY-SA 3.0), Armadillo (Charles J. Sharp, CC BY-SA 4.0), Butterfly (GabrielleMerk, CC BY-SA 4.0), Capybara (Giles Laurent, CC BY-SA 4.0), Chinchilla (Jon Gudorf Photography, CC BY-SA 2.0), Condor (Eric Kilby, CC BY-SA 2.0), Caiman (Charles J. Sharp, CC BY-SA 4.0), Dolphin (Julien Renoult, CC BY 4.0), Eagle (gailhampshire, CC BY 2.0), Flamingo (Thomas Fuhrmann, CC BY-SA 4.0), Frog (Rhododendrites, CC BY-SA 4.0), Guanaco (Charles J. Sharp, CC BY-SA 4.0), Hummingbird (Andy Morffew, CC BY 2.0), Iguana (Rjcastillo, CC BY-SA 3.0), Jaguar (Charles J. Sharp, CC BY-SA 4.0), Llama (Diego Delso, CC BY-SA 3.0), Macaw (Rene Cortin, CC BY-SA 4.0), Monkey (Charles J. Sharp, CC BY-SA 4.0), Ocelot (Giles Laurent, CC BY-SA 4.0), Otter (Giles Laurent, CC BY-SA 4.0), Penguin (Polinova, CC BY-SA 4.0), Puma (Charles J. Sharp, CC BY-SA 4.0), Rhea (Giles Laurent, CC BY-SA 4.0), Sloth (Charles J. Sharp, CC BY-SA 3.0), Sea Lion (Atsme, CC BY-SA 4.0), Toucan (Giles Laurent, CC BY-SA 4.0), Tapir (Giles Laurent, CC BY-SA 4.0), Vicuña (Kwolana, CC BY-SA 4.0), Whale (Naturedata, CC0). Each photo's credit is also shown in-app under its flashcard.

Run the desktop app from source (with the dependencies above installed):

```sh
python3 launcher.py
```

For a browser preview:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory app
```

Open `http://127.0.0.1:8765` in your browser.

Build the package:

```sh
./build-deb.sh
```

Test storage:

```sh
python3 -m unittest discover -s tests
```

Test the browser UI with Node.js, Playwright, and Chrome installed:

```sh
node tests/browser.cjs
```

Optional environment variables: `PLAYWRIGHT_MODULE` points to a Playwright module directory; `CHROME_BIN` selects a Chromium-family browser executable. Tests run an isolated local server and temporary browser contexts; they do not change installed profiles.

## Validation for 0.1.0

- Profile creation, reload, switching, and independently saved personalization.
- Palette/name-logo generation and manual color/name edits.
- Mouse, keyboard, touch, and legacy mouse-event input.
- Mouse scoring, no miss penalties, flower regrowth, procedurally generated mazes with cheese-trail scurry scoring, bouquet-vase matching across four flower species and six colors, a South America country-placement puzzle, a Patagonian cow-herding round, biome placement on the real map, animal-to-habitat sorting, exact-change coin counting, historical-event ordering, and rapid-click protection.
- Per-game Easy/Medium/Hard difficulty selection and persistence, independent per profile and per game.
- Parent PIN gate, per-child game/difficulty visibility controls, schoolwork assignment, and points/review tracking.
- Pause, resume, timed completion, and best-score persistence.
- Saved sound toggles, volume, and reduced animation.
- Atomic native file replacement, file permissions, invalid-save rejection, and corrupt-file preservation.
- Native GTK launch, native profile save/reload, and mouse scoring on the available Linux host.
- Debian archive metadata, compression, dependencies, installed file paths, and executable permissions.

Ubuntu's WebKit update history: https://ubuntu.com/security/notices/USN-5087-1
Required JavaScript bridge API: https://webkitgtk.org/reference/webkit2gtk/2.42.4/method.JavascriptResult.get_js_value.html
