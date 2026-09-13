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
- **Country Match!** Learn South America: pick a country from the list, then tap its place on a simplified map to fill it in. Medium and Hard add a 60-second timer, and Hard hides the "you're getting warm" highlight so it relies on memory alone.
- **Gaucho Herd!** Tap the cows wandering the Patagonian pampas to send them home to the corral. Medium and Hard add more cows and a timer.
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

- `app/`: HTML, CSS, JavaScript, and original vector icon. Nearly all graphics and music are generated locally with no third-party downloads, with one exception: the Country Match! map's country borders are traced from real geographic path data adapted from [South America-fr.svg](https://commons.wikimedia.org/wiki/File:South_America-fr.svg) (Sémhur, DavoO, Themightyquill, derived from Yug's South America-en.svg), CC BY-SA 3.0.
- `launcher.py`: Python 3.6-compatible GTK desktop host, native profile storage, and local-only navigation.
- `build-deb.sh`: builds an architecture-independent, gzip-compressed Debian package using `dpkg-deb`.
- `tests/`: native storage tests and browser integration tests.

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
- Mouse scoring, no miss penalties, flower regrowth, procedurally generated mazes with cheese-trail scurry scoring, bouquet-vase matching across four flower species and six colors, a South America country-placement puzzle, a Patagonian cow-herding round, and rapid-click protection.
- Per-game Easy/Medium/Hard difficulty selection and persistence, independent per profile and per game.
- Parent PIN gate, per-child game/difficulty visibility controls, schoolwork assignment, and points/review tracking.
- Pause, resume, timed completion, and best-score persistence.
- Saved sound toggles, volume, and reduced animation.
- Atomic native file replacement, file permissions, invalid-save rejection, and corrupt-file preservation.
- Native GTK launch, native profile save/reload, and mouse scoring on the available Linux host.
- Debian archive metadata, compression, dependencies, installed file paths, and executable permissions.

Ubuntu's WebKit update history: https://ubuntu.com/security/notices/USN-5087-1
Required JavaScript bridge API: https://webkitgtk.org/reference/webkit2gtk/2.42.4/method.JavascriptResult.get_js_value.html
