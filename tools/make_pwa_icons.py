"""Render the PWA icons from Collection/assets/face-logo.svg onto the blueprint paper colour.

Not part of the site build; run it when the logo changes (needs `pip install cairosvg`):

    python tools/make_pwa_icons.py

The maskable icon keeps the face inside the central safe zone, so Android's circle or
squircle masks do not clip it.
"""
import re
from pathlib import Path

import cairosvg

ROOT = Path(__file__).resolve().parent.parent
LOGO = ROOT / "Collection/assets/face-logo.svg"
OUT = ROOT / "Collection/assets/icons"
PAPER = "#e6f0f8"  # --bp-paper in blueprint.css
LOGO_W, LOGO_H = 572, 655  # the logo's viewBox

# file name: (pixel size, logo height as a share of the icon)
ICONS = {
    "icon-192.png": (192, 0.78),
    "icon-512.png": (512, 0.78),
    "icon-maskable-512.png": (512, 0.56),
    "apple-touch-icon.png": (180, 0.78),
}


def render(size, share):
    inner = re.sub(r"^<svg[^>]*>|</svg>\s*$", "", LOGO.read_text().strip())
    h = size * share
    w = h * LOGO_W / LOGO_H
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">'
        f'<rect width="{size}" height="{size}" fill="{PAPER}"/>'
        f'<svg x="{(size - w) / 2:.2f}" y="{(size - h) / 2:.2f}" width="{w:.2f}" height="{h:.2f}" '
        f'viewBox="0 0 {LOGO_W} {LOGO_H}">{inner}</svg></svg>'
    )


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (size, share) in ICONS.items():
        cairosvg.svg2png(bytestring=render(size, share).encode(), write_to=str(OUT / name))
        print("wrote", OUT / name)
