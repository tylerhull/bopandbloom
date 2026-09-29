# App icons for the Electron build

`electron-builder` looks in this `build/` folder for the app icon. Until you
drop real icons here, the build still works — it falls back to the default
Electron icon with a warning.

Provide these three, all derived from `../app/icon.svg`:

| File | Platform | Notes |
|------|----------|-------|
| `icon.icns` | macOS | 512×512 (with @2x = 1024) inside an `.icns` bundle |
| `icon.ico`  | Windows | multi-size `.ico` (include 256×256) |
| `icon.png`  | Linux | 512×512 PNG |

## Generating them

There's no SVG→icon converter in the dev sandbox, so generate these on a
machine that has the tools. One common path:

```bash
# 1. SVG -> a big PNG (needs rsvg-convert, from librsvg)
rsvg-convert -w 1024 -h 1024 app/icon.svg -o build/icon-1024.png
cp build/icon-1024.png build/icon.png        # Linux uses this (512+ is fine)

# 2. PNG -> .icns (macOS; iconutil is built in on a Mac) or use a tool like
#    https://github.com/pornel/libicns, or `png2icns build/icon.icns build/icon-1024.png`

# 3. PNG -> .ico (Windows; ImageMagick):
convert build/icon-1024.png -define icon:auto-resize=256,128,64,48,32,16 build/icon.ico
```

Keep the icons visually identical to `app/icon.svg` so the app looks the same
everywhere.
