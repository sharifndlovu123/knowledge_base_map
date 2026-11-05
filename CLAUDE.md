# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A personal technical knowledge base (markdown notes for learning tech), published as a static site at knowledgebase.devbridge.co.za. There is no application code and no test suite: the "test" is a clean site build. Content lives in `Collection/`; `mkdocs.yml` sets `docs_dir: 'Collection'`. The build tool is **Zensical** (successor to Material for MkDocs), which reads `mkdocs.yml`.

`README.md` ("Structure" section) and `setup.md` are stale: they mention a `docs/` folder and a DigitalOcean/MkDocs setup. `docs/` only holds design specs, not site content.

## Commands

```bash
pip install -r requirements.txt     # zensical, pymdown-extensions, and tools/ installed editable (-e .)
zensical serve                      # live-reload at http://127.0.0.1:8000
zensical build --clean              # output to site/ (gitignored; deployed by Cloudflare Workers via wrangler.jsonc)
```

CI (`.github/workflows/checks.yml`) runs `zensical build --clean` and **fails on any `WARNING`/`ERROR`** (broken links, unresolved `[[wikilinks]]`, bad config). The only tolerated message is the `nav item '...' doesn't match` warning from the `"..."` catch-all in `.nav.yml` files. It also fails if an excluded private folder appears in `site/`, and runs gitleaks. Build locally and check for warnings before committing.

`python tools/make_pwa_icons.py` regenerates PWA icons from `Collection/assets/face-logo.svg` (needs `cairosvg`; not part of the build).

## Architecture

- **Navigation is per-folder, not in mkdocs.yml.** The `awesome-nav` plugin reads `.nav.yml` files inside `Collection/`. Top-level section order is `Collection/.nav.yml`; each section folder has its own `.nav.yml` giving plain labels, e.g. `- "Kubernetes": "3. Kubernetes"`. A new section or folder must be registered in its parent `.nav.yml`. The trailing `"..."` entry collects anything unlisted. Home-page cards are in `Collection/index.md`.
- **Wikilinks** (`[[Page]]`, `[[Page|alias]]`, `[[Page#Heading]]`, `![[image.png]]`) come from the custom Python-Markdown extension `tools/obsidian_links.py` (configured under `markdown_extensions` in `mkdocs.yml`). Targets resolve **by file name anywhere under `Collection/`**, so link to real, unique filenames. Inside a markdown table, escape the alias pipe: `[[Page\|Alias]]`.
- **Private content is excluded from the site** in two places that must stay in sync: the `exclude` plugin globs and the `obsidian_links` `exclude` list in `mkdocs.yml` (currently `DevBridge/`, `02. Networking/My Roadmap/`, `Frameworks/Django/`). CI asserts those paths never reach `site/`. Such files can still be visible in the git repo.
- `use_directory_urls: false`, so pages are `page.html`. Mermaid diagrams work via the `pymdownx.superfences` fence. Theme overrides are in `overrides/`; custom CSS/JS (blueprint theme, reading mode, mermaid zoom, PWA) are in `Collection/assets/`.
- **PWA / service worker:** `Collection/sw.js` caches pages under `VERSION`. Bump `VERSION` to evict old client caches when changing cached assets. `manifest.webmanifest` and `offline.html` live in `Collection/` too.
- Top-level sections are numbered folders in `Collection/` (`01. Linux`, `02. Networking`, ...), plus `index.md`, `About.md`, `Whats New.md`, `Work In IT.md`.

## Content conventions

Some come from `docs/superpowers/specs/2026-11-02-business-collection-design.md`; the rest were settled while adding later sections.

- **Scope:** this is a technical library for learning tech. Do not write tax, legal, regulatory or investment content (e.g. no SARS/tax notes), and keep DevBridge client or finance specifics out of public notes.
- **Numbering:** files are `N. Title.md` and the first heading is `# NN. Title` (two digits, counted within its own folder, no gaps). No `title:` front matter. Folder names must not end in `.md`. `ls` the whole parent folder before picking a number. Follow neighbouring folders' wikilink style.
- **Style:** terse bullets, tables for comparisons, code blocks only where relevant, filed by subject not by book. Typical note shape: one-line scope, credit callout, "At a glance" table, body, mistakes, `## Recall` with answers in `??? note "Answers"`, `## Links`.
- **Mermaid pitfalls:** no `<br/>` in labels; quote labels containing parentheses; avoid `quadrantChart`, `mindmap`, and `.-x` arrows; use `(["Queue"])` for rounded nodes (`[[X]]` looks like a wikilink). Draw 2x2 matrices as a table or flowchart.
- **Images** go in `Collection/assets/`.
- **Sources and credit:**
  - Book-derived notes carry `> **Based on:** *Title* by Author (year). [Bookshop](https://bookshop.org/book/<ISBN>)` and are written in own words. Never link PDFs, pirated copies or local paths; only bookshop.org by a verified ISBN.
  - Gap-filling notes open with `> **Not from the library.** …`. Time-sensitive facts need an "as of <date>" and an official source.
  - Technical notes end with `## External references`: only original/official sources (official docs, EIPs/BIPs/RFCs, specs, original papers, official repos or project-published post-mortems), each fetched and confirmed before linking. No blogs, news, Wikipedia or aggregators.
- Verify technical claims against primary sources before writing them down; if something cannot be verified, soften or drop it rather than assert it. Keep figures such as loss amounts approximate unless sourced.
- When adding a section or notable content, update `Collection/Whats New.md` (existing bullet style), `Collection/index.md` and the parent `.nav.yml`.

## Git

- Develop on the branch the session names and push there. Commit only when asked or when a session hook asks for it; never push to `main` unless the user explicitly says to.
- Doc and spec hosts must be allowed in the cloud environment's network settings before they can be fetched; if a fetch fails with 403 or a DNS error, say so rather than citing from memory.
