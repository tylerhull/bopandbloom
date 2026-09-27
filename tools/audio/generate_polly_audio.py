#!/usr/bin/env python3
"""Generate every Bop & Bloom read-aloud clip with Amazon Polly.

Reads tools/audio/facts_manifest.csv (Game, Track, File, Phrase) and, for
each row, calls Polly's SynthesizeSpeech and writes the result to
app/audio/<File> (creating game subfolders as needed) - e.g. a File of
"countries/venezuela_01.mp3" is written to app/audio/countries/venezuela_01.mp3.

Requires, on the machine you run this on (NOT needed to just play the app):
  - Python 3.8+
  - `pip install boto3`
  - AWS credentials with Polly access, either via `aws configure`,
    environment variables (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY /
    AWS_DEFAULT_REGION), or any other method boto3 supports.
  - An AWS account with Polly enabled. Polly is pay-per-character past the
    free tier (5 million characters/month free for your first 12 months);
    this manifest is a little under 20,000 characters total, so a full run
    costs at most a few cents even outside the free tier - see
    https://aws.amazon.com/polly/pricing/.

Usage:
    python3 tools/audio/generate_polly_audio.py --dry-run
        # prints what would be generated, calls AWS for nothing - use this
        # first to sanity-check the manifest before spending anything.

    python3 tools/audio/generate_polly_audio.py
        # generates every clip that doesn't already exist.

    python3 tools/audio/generate_polly_audio.py --force
        # regenerates every clip even if the file already exists (use
        # after changing --voice/--engine, or after editing a phrase and
        # rerunning build_audio_map.py).

    python3 tools/audio/generate_polly_audio.py --only countries
        # only (re)generate one game's clips - the part of File before
        # the first "/" (countries, gauchos, peaks, biomes, animalsort,
        # letters).

    python3 tools/audio/generate_polly_audio.py --voice Matthew --engine neural
        # pick a different reader. Good options for English:
        #   Joanna, Matthew, Ruth, Stephen  - clear adult voices (default: Joanna)
        #   Kevin                            - Polly's child voice (neural only)
        #   Ivy                              - young female (standard engine only)
        # Full list: https://docs.aws.amazon.com/polly/latest/dg/available-voices.html
"""
import argparse
import csv
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
MANIFEST = os.path.join(HERE, "facts_manifest.csv")
AUDIO_ROOT = os.path.join(HERE, "..", "..", "app", "audio")


def load_rows():
    with open(MANIFEST, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--voice", default="Joanna", help="Polly VoiceId (default: Joanna)")
    ap.add_argument("--engine", default="neural", choices=["standard", "neural", "long-form", "generative"],
                     help="Polly engine (default: neural; not every voice supports every engine)")
    ap.add_argument("--only", default=None, help="only regenerate this game's folder (e.g. countries, letters)")
    ap.add_argument("--force", action="store_true", help="regenerate even if the output file already exists")
    ap.add_argument("--dry-run", action="store_true", help="print what would happen, call AWS for nothing")
    ap.add_argument("--sleep", type=float, default=0.1, help="seconds to pause between requests (default 0.1)")
    args = ap.parse_args()

    rows = load_rows()
    if args.only:
        rows = [r for r in rows if r["File"].split("/", 1)[0] == args.only]
        if not rows:
            sys.exit(f"No rows found for --only {args.only!r}. "
                     f"Valid values are the folder names in tools/audio/facts_manifest.csv's File column.")

    todo = []
    for row in rows:
        out_path = os.path.join(AUDIO_ROOT, row["File"])
        if not args.force and os.path.exists(out_path):
            continue
        todo.append((row, out_path))

    print(f"{len(rows)} rows in manifest" + (f" (filtered to --only {args.only})" if args.only else ""))
    print(f"{len(todo)} clip(s) to generate with voice={args.voice} engine={args.engine}"
          f"{' (--force: regenerating all)' if args.force else ' (skipping ones that already exist)'}")

    if args.dry_run:
        for row, out_path in todo:
            print(f"  [{row['Game']}] {row['File']:40s} <- {row['Phrase'][:70]}")
        print("\n--dry-run: no audio generated, no AWS calls made.")
        return

    if not todo:
        print("Nothing to do (use --force to regenerate existing files).")
        return

    try:
        import boto3
    except ImportError:
        sys.exit("boto3 is not installed. Run: pip install boto3")

    polly = boto3.client("polly")

    ok, failed = 0, []
    for i, (row, out_path) in enumerate(todo, start=1):
        phrase = row["Phrase"]
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        try:
            resp = polly.synthesize_speech(
                Text=phrase,
                OutputFormat="mp3",
                VoiceId=args.voice,
                Engine=args.engine,
            )
            with open(out_path, "wb") as f:
                f.write(resp["AudioStream"].read())
            ok += 1
            print(f"[{i}/{len(todo)}] OK   {row['File']}")
        except Exception as e:
            failed.append((row["File"], str(e)))
            print(f"[{i}/{len(todo)}] FAIL {row['File']}: {e}")
        if args.sleep:
            time.sleep(args.sleep)

    print(f"\n{ok} generated, {len(failed)} failed.")
    if failed:
        print("Failed rows (rerun the script - it skips already-generated files - to retry just these):")
        for file, err in failed:
            print(f"  {file}: {err}")
        sys.exit(1)


if __name__ == "__main__":
    main()
