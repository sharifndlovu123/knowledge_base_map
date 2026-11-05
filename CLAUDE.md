# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A personal knowledge base (markdown notes) published as a static site at knowledgebase.devbridge.co.za. There is no application code and no test suite: the "test" is a clean site build. Content lives in `Collection/`; `mkdocs.yml` sets `docs_dir: 'Collection'`. The build tool is **Zensical** (successor to Material for MkDocs), which reads `mkdocs.yml`.

Note: `README.md` ("Structure" section) and `setup.md` are stale. They mention a `docs/` folder and a DigitalOcean/MkDocs setup. `docs/` only holds design specs, not site content.

## Commands

```bash
pip install -r requirements.txt     # zensical, pymdown-extensions, and tools/ installed editable (-e .)
zensical serve                      # live-reload at http://127.0.0.1:8000
zensical build --clean              # output to site/ (gitignored; deployed by Cloudflare Workers via wrangler.jsonc)
```

CI (`.github/workflows/checks.yml`) runs `zensical build --clean` and **fails on any `WARNING`/`ERROR`** (broken links, unresolved `[[wikilinks]]`, bad config). The only tolerated message is the `nav item '...' doesn't match` warning from the `"..."` catch-all in `.nav.yml` files. It also fails if an excluded private folder appears in `site/`, and runs gitleaks. Run the build locally and check for warnings before committing.

`python tools/make_pwa_icons.py` regenerates PWA icons from `Collection/assets/face-logo.svg` (needs `cairosvg`; not part of the build).

## Architecture

- **Navigation is per-folder, not in mkdocs.yml.** The `awesome-nav` plugin reads `.nav.yml` files inside `Collection/`. Top-level section order is `Collection/.nav.yml`; each section folder has its own `.nav.yml` giving plain labels, e.g. `- "Kubernetes": "3. Kubernetes"`. A new section/folder must be registered in the parent `.nav.yml`. The trailing `"..."` entry collects anything unlisted.
- **Wikilinks** (`[[Page]]`, `[[Page|alias]]`, `[[Page#Heading]]`, `![[image.png]]`) are handled by the custom Python-Markdown extension `tools/obsidian_links.py` (configured under `markdown_extensions` in `mkdocs.yml`). Targets resolve **by file name anywhere under `Collection/`**, so link to real, unique filenames, e.g. `[[11. Frameworks at a Glance|Frameworks at a Glance]]`. Links are emitted root-relative. Folders in its `exclude` list are skipped.
- **Private content is excluded from the site** in two places that must stay in sync: the `exclude` plugin globs and the `obsidian_links` `exclude` list in `mkdocs.yml` (currently `DevBridge/`, `02. Networking/My Roadmap/`, `Frameworks/Django/`). CI asserts those paths never reach `site/`. Such files can still be visible in the git repo.
- `use_directory_urls: false`, so pages are `page.html`. Mermaid diagrams are supported via `pymdownx.superfences` (```` ```mermaid ````). Custom theme overrides are in `overrides/`; custom CSS/JS (blueprint theme, reading mode, mermaid zoom, PWA) are in `Collection/assets/`.
- **PWA / service worker:** `Collection/sw.js` caches pages under `VERSION` (currently `kb-v2`). Bump `VERSION` to evict old client caches when changing cached assets. `manifest.webmanifest` and `offline.html` live in `Collection/` too.
- Top-level sections: `01. Linux` … `12. Business`, plus `index.md`, `About.md`, `Whats New.md`, `Work In IT.md`.

## Content conventions

Taken from `docs/superpowers/specs/2026-11-02-business-collection-design.md`, which applies vault-wide where noted:

- **Numbering:** files are `N. Title.md` and the first heading is `# NN. Title` (two digits, counted within its own folder, no gaps). No `title:` front matter. Folder names must not end in `.md`. `ls` the whole parent folder before picking a number. Follow the neighbouring folders' style for wikilinks.
- **Style:** terse bullets, tables for comparisons, code blocks only where relevant. Filed by subject, not by book.
- **Mermaid pitfalls:** no `<br/>` in labels; quote labels containing parentheses; avoid `quadrantChart`, `mindmap`, and `.-x` arrows; use `(["Queue"])` for rounded nodes (`[[X]]` looks like a wikilink). Draw 2x2 matrices as a table or flowchart.
- **Images** go in `Collection/assets/`.
- **Sources and credit (Business section pattern):** book-derived notes carry a `> **Based on:** *Title* by Author (year). [Bookshop](https://bookshop.org/book/<ISBN>)` callout and are written in own words (no copied passages, no links to PDFs/pirated copies/local paths). Only link bookshop.org by a verified ISBN. Gap-filling notes open with `> **Not from the library.** …`; time-sensitive facts (e.g. South African tax) need an "as of <date>" and an official source.
- Keep generic: no DevBridge client/finance specifics in public notes.
- When adding a section or notable content, update `Collection/Whats New.md` in its existing bullet style.
- Do not commit unless asked.
