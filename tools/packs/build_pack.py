#!/usr/bin/env python3
"""Build a distributable Bop & Bloom content pack (.bop) from a folder of images.

A pack is a single JSON file with every image embedded as a data: URI, so it's
one self-contained file a parent can download and add in the Parent Area (the
app accepts image items only — no external files, no markup). Output shape:

    {
      "id": "farm-animals",
      "name": "Farm Animals",
      "blurb": "12 friendly farm animals",
      "tag": "Animals",
      "items": [ {"id": "cow", "label": "Cow", "image": "data:image/jpeg;base64,...", "pt": 66.7}, ... ]
    }

Usage:
    python3 tools/packs/build_pack.py --dir path/to/images --id farm-animals \
        --name "Farm Animals" [--blurb "..."] [--tag Animals] [--out farm-animals.bop]
    # optional --labels labels.csv with rows: filename,Label   (overrides the
    # auto label, which is otherwise the file name without extension, title-cased)

`pt` (the card's height:width ratio as a percent) is computed from each image
if Pillow is installed; otherwise it defaults to 75. Images render fine either
way — pt just avoids letter-boxing.
"""
import argparse
import base64
import csv
import json
import os
import re
import sys

MIME = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
        '.gif': 'image/gif', '.webp': 'image/webp'}

try:
    from PIL import Image  # optional
    HAVE_PIL = True
except Exception:
    HAVE_PIL = False


def slug(s):
    return re.sub(r'[^a-z0-9-]', '', re.sub(r'\s+', '-', s.strip().lower()))


def title_from_filename(name):
    stem = os.path.splitext(name)[0].replace('_', ' ').replace('-', ' ')
    return ' '.join(w.capitalize() for w in stem.split())


def main():
    ap = argparse.ArgumentParser(description='Build a Bop & Bloom content pack (.bop).')
    ap.add_argument('--dir', required=True, help='folder of images')
    ap.add_argument('--id', required=True, help='pack id (lowercase, digits, dashes)')
    ap.add_argument('--name', required=True, help='display name')
    ap.add_argument('--blurb', default='', help='short description')
    ap.add_argument('--tag', default='Imported', help='topic tag')
    ap.add_argument('--labels', help='optional CSV: filename,Label')
    ap.add_argument('--out', help='output file (default: <id>.bop)')
    args = ap.parse_args()

    if not re.match(r'^[a-z0-9][a-z0-9-]{0,39}$', args.id):
        sys.exit('error: --id must be lowercase letters/digits/dashes, 1-40 chars')
    if not os.path.isdir(args.dir):
        sys.exit('error: --dir is not a directory: ' + args.dir)

    labels = {}
    if args.labels:
        with open(args.labels, newline='', encoding='utf-8') as f:
            for row in csv.reader(f):
                if len(row) >= 2:
                    labels[row[0].strip()] = row[1].strip()

    items = []
    for name in sorted(os.listdir(args.dir)):
        ext = os.path.splitext(name)[1].lower()
        if ext not in MIME:
            continue
        path = os.path.join(args.dir, name)
        with open(path, 'rb') as fh:
            data = fh.read()
        uri = 'data:' + MIME[ext] + ';base64,' + base64.b64encode(data).decode('ascii')
        pt = 75.0
        if HAVE_PIL:
            try:
                with Image.open(path) as im:
                    w, h = im.size
                    if w:
                        pt = round(h / w * 100, 2)
            except Exception:
                pass
        items.append({
            'id': slug(os.path.splitext(name)[0]) or ('item-' + str(len(items))),
            'label': labels.get(name, title_from_filename(name)),
            'image': uri,
            'pt': pt
        })

    if not items:
        sys.exit('error: no images (png/jpg/jpeg/gif/webp) found in ' + args.dir)

    pack = {'id': args.id, 'name': args.name, 'blurb': args.blurb, 'tag': args.tag, 'items': items}
    out = args.out or (args.id + '.bop')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(pack, f)
    size_kb = round(os.path.getsize(out) / 1024)
    print('wrote %s — %d cards, %d KB%s' % (out, len(items), size_kb,
          '' if HAVE_PIL else ' (install Pillow for exact card shapes)'))


if __name__ == '__main__':
    main()
