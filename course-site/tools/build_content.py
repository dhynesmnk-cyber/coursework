#!/usr/bin/env python3
"""Build assets/js/content.js from the markdown sources in content-src/.

Run from the course-site directory:  python3 tools/build_content.py
Re-run any time the source markdown changes.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "content-src"
OUT = ROOT / "assets" / "js" / "content.js"

CLASS_FILES = sorted(SRC.glob("0[1-6]-class*.md"))
DOC_FILES = sorted(SRC.glob("0[7-9]-doc*.md")) + sorted(SRC.glob("1[0-6]-doc*.md"))
EXTRA_FILES = [SRC / "17-facilitator-notes.md", SRC / "18-research-notes-and-sources.md"]


def split_title(md: str):
    """Pull the first # heading out as the title; return (title, remaining_md)."""
    lines = md.splitlines()
    title = ""
    body_start = 0
    for i, line in enumerate(lines):
        if line.startswith("# "):
            title = line[2:].strip()
            body_start = i + 1
            break
    body = "\n".join(lines[body_start:]).lstrip("\n")
    # Drop the second-level subtitle line directly after the title if present,
    # keep it as subtitle.
    subtitle = ""
    m = re.match(r"###\s*(.+)\n", body)
    if m:
        subtitle = m.group(1).strip()
        body = body[m.end():]
    return title, subtitle, body


def slugify(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s


def build_item(path: Path):
    md = path.read_text(encoding="utf-8")
    title, subtitle, body = split_title(md)
    return {
        "slug": slugify(path.stem.split("-", 1)[1] if "-" in path.stem else path.stem),
        "sourceFile": path.name,
        "title": title,
        "subtitle": subtitle,
        "md": body,
    }


def main():
    data = {
        "classes": [build_item(p) for p in CLASS_FILES],
        "docs": [build_item(p) for p in DOC_FILES],
        "extras": [build_item(p) for p in EXTRA_FILES],
    }
    payload = json.dumps(data, ensure_ascii=False)
    # Guard against accidental </script> inside content breaking the inline script tag.
    payload = payload.replace("</script>", "<\\/script>")
    OUT.write_text(
        "// GENERATED FILE. Do not edit by hand.\n"
        "// Rebuild with: python3 tools/build_content.py\n"
        f"window.COURSE_CONTENT = {payload};\n",
        encoding="utf-8",
    )
    sizes = {k: len(v) for k, v in data.items()}
    print(f"Wrote {OUT.relative_to(ROOT)} "
          f"({OUT.stat().st_size/1024:.0f} KB): "
          f"{sizes['classes']} classes, {sizes['docs']} docs, {sizes['extras']} extras")


if __name__ == "__main__":
    main()
