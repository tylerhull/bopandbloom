#!/usr/bin/env python3
"""Stamp app/index.html's <link>/<script> blocks with per-file cache-busters.

Why: index.html loads ~40 css/js files as plain classic tags (no bundler, so
the app keeps working from a file:// URL). Each needs a ?v= cache-buster or a
browser will happily serve a stale copy across reloads. Hand-bumping ~40
identical ?v=N tags on every edit was pure churn; this script regenerates the
two marked blocks from disk instead, stamping each file with a short hash of
its own contents so the buster changes exactly when (and only when) that file
changes.

Run it after editing anything under app/js or app/css:

    python3 tools/build_index.py          # rewrite index.html in place
    python3 tools/build_index.py --check  # exit 1 if it would change (for CI)

CSS load order does not matter (no cross-file overrides — see ARCHITECTURE.md),
so css files are emitted in sorted order. JS load order DOES matter and is
carried by the numeric filename prefix (01-, 02-, ...), which sorts correctly.
"""
import glob
import hashlib
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, 'app')
INDEX = os.path.join(APP, 'index.html')


def short_hash(path):
    with open(path, 'rb') as fh:
        return hashlib.sha1(fh.read()).hexdigest()[:8]


def rel_files(subdir, ext):
    paths = sorted(glob.glob(os.path.join(APP, subdir, '*.' + ext)))
    return [(subdir + '/' + os.path.basename(p), short_hash(p)) for p in paths]


def css_block():
    lines = ['<link rel="stylesheet" href="%s?v=%s">' % (rel, h)
             for rel, h in rel_files('css', 'css')]
    return '\n'.join(lines)


def js_block():
    lines = ['<script src="%s?v=%s"></script>' % (rel, h)
             for rel, h in rel_files('js', 'js')]
    return '\n'.join(lines)


def replace_block(html, name, body):
    # Replace everything between "<!-- build:NAME ... -->" and "<!-- /build:NAME -->".
    pattern = re.compile(
        r'(<!-- build:%s\b[^>]*-->\n).*?(\n<!-- /build:%s -->)' % (name, name),
        re.DOTALL)
    if not pattern.search(html):
        sys.exit('error: no build:%s markers in %s' % (name, INDEX))
    return pattern.sub(lambda m: m.group(1) + body + m.group(2), html)


def main():
    check = '--check' in sys.argv[1:]
    with open(INDEX, 'r') as fh:
        original = fh.read()
    updated = replace_block(original, 'css', css_block())
    updated = replace_block(updated, 'js', js_block())
    if updated == original:
        print('index.html already up to date')
        return 0
    if check:
        print('index.html is stale — run: python3 tools/build_index.py')
        return 1
    with open(INDEX, 'w') as fh:
        fh.write(updated)
    print('index.html updated')
    return 0


if __name__ == '__main__':
    sys.exit(main())
