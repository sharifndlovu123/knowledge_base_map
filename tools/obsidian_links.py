"""Python-Markdown extension for Obsidian [[wikilinks]] and ![[image]] embeds.

Stands in for mkdocs-obsidian-bridge, which Zensical cannot run. Targets are
resolved by file name anywhere under docs_dir, as Obsidian does. Links are
emitted root-relative (base_url + path), which suits the site being served at
the domain root.

    [[Page]]  [[Page|alias]]  [[Page#Heading]]  [[#Heading]]  ![[image.png]]
"""
import re
import sys
from pathlib import Path
from urllib.parse import quote
from xml.etree import ElementTree as etree

from markdown import Extension
from markdown.inlinepatterns import InlineProcessor
from markdown.preprocessors import Preprocessor

PIPE = r"(?:\||&\#124;)"
PATTERN = rf"(!?)\[\[([^\]\n|#&]*)(?:#([^\]\n|&]*))?(?:{PIPE}([^\]\n]*))?\]\]"
# Code spans are matched first so literal examples keep their pipes.
PROTECT = re.compile(r"(`+)[^`\n]*?\1|\[\[[^\]\n]*\]\]")
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif"}


def slugify(text):
    text = re.sub(r"[^\w\s-]", "", text.strip().lower())
    return re.sub(r"[-\s]+", "-", text)


class ProtectPipes(Preprocessor):
    """Hide the | in [[Target|alias]] from the table parser, which splits cells on it."""

    def run(self, lines):
        def fix(m):
            return m.group(0) if m.group(1) else m.group(0).replace("\\|", "|").replace("|", "&#124;")

        return [PROTECT.sub(fix, line) for line in lines]


class WikiLinks(InlineProcessor):
    def __init__(self, pattern, md, pages, files, base_url):
        super().__init__(pattern, md)
        self.pages, self.files, self.base_url = pages, files, base_url

    def handleMatch(self, m, data):
        bang, target, heading, alias = m.groups()
        target = target.strip()
        if bang:
            return self.embed(target), m.start(0), m.end(0)

        if target:
            path = self.pages.get(target.lower())
            if path is None:
                print(f"WARNING -  wikilinks: no page named '{target}'", file=sys.stderr)
                el = etree.Element("span", {"class": "wikilink-missing"})
                el.text = alias or target
                return el, m.start(0), m.end(0)
            href = self.base_url + quote(path)
        else:
            href = ""
        if heading:
            href += "#" + slugify(heading)

        el = etree.Element("a", {"href": href})
        el.text = alias or (f"{target} > {heading}" if target and heading else target or heading)
        return el, m.start(0), m.end(0)

    def embed(self, target):
        name = target.split("|")[0].strip()
        path = self.files.get(name.lower())
        if path is None or Path(name).suffix.lower() not in IMAGE_EXTS:
            print(f"WARNING -  wikilinks: no image named '{name}'", file=sys.stderr)
            el = etree.Element("span", {"class": "wikilink-missing"})
            el.text = name
            return el
        return etree.Element("img", {"src": self.base_url + quote(path), "alt": Path(name).stem})


class WikiLinksExtension(Extension):
    def __init__(self, **kwargs):
        self.config = {
            "docs_dir": ["Collection", "Folder holding the notes"],
            "base_url": ["/", "Prefix for generated links"],
            "exclude": [[], "Folder prefixes (relative to docs_dir) never linked to"],
        }
        super().__init__(**kwargs)

    def extendMarkdown(self, md):
        root = Path(self.getConfig("docs_dir"))
        excluded = tuple(self.getConfig("exclude"))
        pages, files = {}, {}
        for f in sorted(root.rglob("*")):
            rel = f.relative_to(root).as_posix()
            if not f.is_file() or rel.startswith(excluded) or ".obsidian" in f.parts:
                continue
            if f.suffix == ".md":
                pages.setdefault(f.stem.lower(), rel[:-3] + ".html")
            else:
                files.setdefault(f.name.lower(), rel)
        md.preprocessors.register(ProtectPipes(md), "wikilink_pipes", 20)
        md.inlinePatterns.register(
            WikiLinks(PATTERN, md, pages, files, self.getConfig("base_url")), "wikilinks", 135
        )


def makeExtension(**kwargs):
    return WikiLinksExtension(**kwargs)
