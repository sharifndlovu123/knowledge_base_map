"""Post-build SEO step for the built site (site/).

    python tools/seo_postbuild.py            # make sitemap URLs extensionless, matching the canonical URLs
    python tools/seo_postbuild.py --check    # fail if any page lacks a title, description or canonical

Why: the pages are canonicalised without ".html" (see overrides/main.html) because the host serves
extensionless URLs, but the generated sitemap.xml lists ".html" URLs. Search engines then see sitemap
entries that redirect. Run this after `zensical build` so the sitemap lists the canonical URLs.
Standard library only, so it also runs in the hosting build environment.
"""
import re
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"
SKIP = {"404.html", "offline.html"}


def canonical(url: str) -> str:
    if url.endswith("/index.html"):
        return url[: -len("index.html")]
    if url.endswith(".html"):
        return url[: -len(".html")]
    return url


def normalise_sitemap() -> int:
    path = SITE / "sitemap.xml"
    text = path.read_text(encoding="utf-8")
    seen, changed = set(), 0

    def fix(match: "re.Match[str]") -> str:
        nonlocal changed
        old = match.group(1)
        new = canonical(old)
        changed += old != new
        return f"<loc>{new}</loc>"

    text = re.sub(r"<loc>([^<]+)</loc>", fix, text)
    # drop duplicate <url> entries and the 404 page, if present
    blocks = re.findall(r"\s*<url>.*?</url>", text, re.S)
    kept = []
    for b in blocks:
        loc = re.search(r"<loc>([^<]+)</loc>", b).group(1)
        if loc in seen or loc.endswith("/404"):
            continue
        seen.add(loc)
        kept.append(b)
    head = text[: text.index("<url>")].rstrip()
    path.write_text(head + "".join(kept) + "\n</urlset>\n", encoding="utf-8")
    print(f"sitemap: {len(kept)} URLs, {changed} rewritten to their canonical form")
    return 0


def check() -> int:
    problems = []
    pages = [p for p in SITE.rglob("*.html") if p.name not in SKIP]
    for page in pages:
        head = page.read_text(encoding="utf-8", errors="ignore").split("</head>")[0]
        rel = page.relative_to(SITE)
        if not re.search(r"<title>[^<]{3,}</title>", head):
            problems.append(f"{rel}: missing <title>")
        m = re.search(r'<meta name="description" content="([^"]*)"', head)
        if not m or len(m.group(1).strip()) < 40:
            problems.append(f"{rel}: missing or very short meta description")
        if not re.search(r'<link rel="canonical" href="https://[^"]+"', head):
            problems.append(f"{rel}: missing canonical")
        elif re.search(r'<link rel="canonical" href="[^"]+\.html"', head):
            problems.append(f"{rel}: canonical still ends in .html")
    sitemap = (SITE / "sitemap.xml").read_text(encoding="utf-8")
    if re.search(r"\.html</loc>", sitemap):
        problems.append("sitemap.xml still lists .html URLs (run tools/seo_postbuild.py)")
    print(f"checked {len(pages)} pages")
    for p in problems[:40]:
        print("  -", p)
    if problems:
        print(f"{len(problems)} SEO problem(s)")
        return 1
    print("SEO checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(check() if "--check" in sys.argv else normalise_sitemap())
