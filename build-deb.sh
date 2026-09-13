#!/bin/sh
set -eu
SOURCE_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DEST_DIR=${1:-"$SOURCE_DIR/.."}
mkdir -p "$DEST_DIR"
STAGING_DIR=$(mktemp -d)
trap 'rm -rf "$STAGING_DIR"' EXIT HUP INT TERM
mkdir -p "$STAGING_DIR/DEBIAN" "$STAGING_DIR/usr/share/bop-and-bloom/app" "$STAGING_DIR/usr/bin" "$STAGING_DIR/usr/share/applications" "$STAGING_DIR/usr/share/icons/hicolor/scalable/apps" "$STAGING_DIR/usr/share/doc/bop-and-bloom"
cp "$SOURCE_DIR/launcher.py" "$STAGING_DIR/usr/share/bop-and-bloom/launcher.py"
cp "$SOURCE_DIR"/app/* "$STAGING_DIR/usr/share/bop-and-bloom/app/"
cp "$SOURCE_DIR/README.md" "$STAGING_DIR/usr/share/doc/bop-and-bloom/README.md"
cp "$SOURCE_DIR/app/icon.svg" "$STAGING_DIR/usr/share/icons/hicolor/scalable/apps/bop-and-bloom.svg"
cat > "$STAGING_DIR/usr/bin/bop-and-bloom" <<'LAUNCH'
#!/bin/sh
exec /usr/bin/python3 /usr/share/bop-and-bloom/launcher.py "$@"
LAUNCH
chmod 755 "$STAGING_DIR/usr/bin/bop-and-bloom"
cat > "$STAGING_DIR/usr/share/applications/bop-and-bloom.desktop" <<'DESKTOP'
[Desktop Entry]
Type=Application
Name=Bop & Bloom
Comment=A little playroom of your own
Exec=bop-and-bloom
Icon=bop-and-bloom
Terminal=false
Categories=Game;KidsGame;Education;
StartupNotify=true
DESKTOP
cat > "$STAGING_DIR/DEBIAN/control" <<'CONTROL'
Package: bop-and-bloom
Version: 0.1.0
Section: games
Priority: optional
Architecture: all
Maintainer: Bop and Bloom Project
Depends: python3 (>= 3.6), python3-gi, gir1.2-gtk-3.0, gir1.2-webkit2-4.0 (>= 2.22) | gir1.2-webkit2-4.1
Description: A personalized offline playroom for little explorers
 Play gentle mouse and flower games in a personalized local playroom.
 Includes local player profiles, personalized name logos, palettes,
 gentle untimed play, and independent music and sound controls.
CONTROL
find "$STAGING_DIR" -type d -exec chmod 755 {} +
find "$STAGING_DIR" -type f ! -path '*/usr/bin/*' -exec chmod 644 {} +
dpkg-deb --root-owner-group -Zgzip --build "$STAGING_DIR" "$DEST_DIR/bop-and-bloom_0.1.0_all.deb"
