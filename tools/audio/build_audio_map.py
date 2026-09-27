#!/usr/bin/env python3
"""Regenerate app/js/07-audio-map.js from tools/audio/facts_manifest.csv.

The manifest is the single source of truth for every piece of read-aloud
text in the app: which game it belongs to, what file it should live at
under app/audio/, and the exact phrase spoken. Run this after editing the
CSV (a changed phrase, a new row) so the in-app lookup table matches.

Usage:
    python3 tools/audio/build_audio_map.py

Run from anywhere; paths below are relative to this script's location.
"""
import csv
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
MANIFEST = os.path.join(HERE, "facts_manifest.csv")
OUT = os.path.join(HERE, "..", "..", "app", "js", "07-audio-map.js")


def main():
    audio_map = {}
    with open(MANIFEST, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            phrase = row["Phrase"].strip()
            file = row["File"].strip()
            if not phrase or not file:
                continue
            if phrase in audio_map and audio_map[phrase] != file:
                raise SystemExit(
                    f"Duplicate phrase with two different files:\n  {phrase!r}\n"
                    f"  -> {audio_map[phrase]}\n  -> {file}"
                )
            audio_map[phrase] = file

    header = (
        "/* Pre-recorded read-aloud audio: exact spoken text -> filename under app/audio/.\n"
        " * GENERATED FILE - do not hand-edit. Edit tools/audio/facts_manifest.csv instead,\n"
        " * then run: python3 tools/audio/build_audio_map.py\n"
        " * See ARCHITECTURE.md's \"Read-aloud audio\" section for the full workflow. */\n"
    )
    body = "var AUDIO_MAP=" + json.dumps(audio_map, ensure_ascii=False, separators=(",", ":")) + ";\n"

    with open(OUT, "w", encoding="utf-8") as f:
        f.write(header + body)

    print(f"wrote {OUT} with {len(audio_map)} entries")


if __name__ == "__main__":
    main()
