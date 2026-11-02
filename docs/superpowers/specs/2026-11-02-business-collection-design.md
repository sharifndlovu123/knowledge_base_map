# Business (MBA) section for the vault: design

Date: 2026-11-02. Status: **draft for approval. Nothing has been built.** Implementation is planned for 2026-11-03.

## 1. Intent and why

Sharif is studying business skills for personal use alongside the technical work the vault already logs. The vault is a learning log: notes record what is learned, in his terse bullet style, and credit the sources. He has collected 19 business books and wants the same treatment: a study and reminder resource he can come back to when a business decision, pitch, price, hire or budget question comes up.

The notes must be **useful for recall**, not book reports. Success means that months from now he can open one page and be reminded of the right framework, how it works, when to reach for it and where it came from.

## 2. Source material

Folder: `~/Documents/Sharif Docs/Books/MBA/`, 19 files (17 PDF, 2 EPUB). All have extractable text (`pdftotext` works; EPUBs unzip to XHTML). Never link or copy these files into the repo.

| Subject | Book (author) |
|---|---|
| Overview | The Personal MBA (Josh Kaufman); What They Teach You at Harvard Business School (Philip Delves Broughton) |
| Strategy | 7 Powers (Hamilton Helmer); Good Strategy / Bad Strategy (Richard Rumelt) |
| Decisions | Thinking in Bets (Annie Duke) |
| Finance | Financial Intelligence (Karen Berman, Joe Knight, John Case); Profit First (Mike Michalowicz) |
| Positioning, customers | Obviously Awesome (April Dunford); The Mom Test (Rob Fitzpatrick) |
| Sales, negotiation | SPIN Selling (Neil Rackham); Never Split the Difference (Chris Voss, Tahl Raz) |
| Pricing | Value-Based Fees (Alan Weiss); Pricing Creativity (Blair Enns) |
| Running the business | High Output Management (Andrew Grove); Traction (Gino Wickman); The E-Myth Revisited (Michael Gerber); Built to Sell (John Warrillow) |
| People | Who: The A Method for Hiring (Geoff Smart, Randy Street); The Trusted Advisor (David Maister, Charles Green, Robert Galford) |

**Sufficiency finding:** the shelf is strong for running a small services or software firm. It is thin on core MBA subjects: accounting, corporate finance and valuation, economics, marketing fundamentals, operations, organisational behaviour, innovation and entrepreneurship, and South African tax and compliance. Sharif approved filling these gaps (see 5).

## 3. Goals, non-goals, anti-goals

**Goals**
- A `12. Business` section, filed **by subject, not by book** (the vault's standing rule).
- Each book's real frameworks captured accurately, in own words.
- Gaps filled with researched general material, clearly labelled as such.
- Recall aids: a "use it when" line per framework and a short set of self-test questions per note.
- Credit to every source book, in line with the vault's practice of paying homage to used content.

**Non-goals**
- Not summaries of whole books chapter by chapter. Not a replacement for reading them.
- Nothing about DevBridge, clients, finances, tenders or any specific business. Frameworks stay generic.
- No exam or course names; the section is "Business", not "MBA exam prep".

**Anti-goals (a failure even if it builds)**
- Copied or lightly paraphrased passages. Anything near-verbatim, or any quote over a short phrase, is a defect.
- Links to the PDFs or EPUBs, to Anna's Archive, Z-Library or any online copy, or to local paths.
- Claims about a book's content that were not read in the book (no writing from memory of "what the book says").
- Gap material passed off as coming from a book, or gap facts (especially South African tax rates and thresholds) stated without a source and an "as of" date.

## 4. Constraints (from the vault)

- Site is mkdocs with the Zensical build; `Collection/` is the docs dir. Awesome-nav via per-folder `.nav.yml`; top-level order in `Collection/.nav.yml` (add `- Business: 12. Business` before the `"..."` line).
- Numbering rule: filename `N. Title.md`, first heading `# NN. Title` (two digits, counted 01, 02, 03 within its own folder, no gaps). Folder labels are plain, set in `.nav.yml` as `- "Label": "NN. folder"`. No `title:` front matter. Folder names must not end in `.md`. Before picking a number, `ls` the whole parent. Follow whatever the neighbouring folders do for wikilinks, `[[N. Stem|Display]]`, and link only to real filenames.
- Style: terse bullets, tables for comparisons, `$` code blocks only where relevant (rare here).
- Mermaid is enabled (`mermaid2`). Rules learned from real builds: no `<br/>` in labels (it is dropped, words run together); quote labels containing parentheses; avoid `quadrantChart`, `mindmap` and `.-x` arrows; use `(["Queue"])` rather than `[[X]]` for rounded nodes (looks like a wikilink). 2x2 matrices are drawn as a table or a flowchart.
- Other drawing tool: not needed by default. If a visual cannot be shown in Mermaid or a table (for example a curve or a waterfall chart), flag it to Sharif and offer Excalidraw (an MCP is available) before doing anything else.
- Images, if any, go in `Collection/assets/`.
- Books: only bookshop.org links by ISBN, after an ISBN check; never pirated or online copies; no exam-prep titles.
- Do not commit unless Sharif asks.

## 5. Gap policy (decided by Sharif)

Fill gaps with researched general material. Each gap note opens with a callout:

> **Not from the library.** General reference material written to fill a gap in the books above.

Gap notes need no book credit but should name where facts came from (an official source for anything South African). Anything that changes over time (tax rates, thresholds, B-BBEE levels) carries an "as of <date>" and a pointer to the official page, and is verified by web search at write time, not from memory.

## 6. Structure

```
Collection/12. Business/
  .nav.yml
  1. Start Here.md          map of the section, how to use it, source table with bookshop links
  2. Foundations/
  3. Strategy/
  4. Finance/
  5. Marketing/
  6. Sales and Negotiation/
  7. Pricing/
  8. Operations and Management/
  9. People/
  10. Economics and Innovation/
  11. Frameworks at a Glance.md      one page of every framework: name, one line, use-it-when, link
```

Each sub-folder gets a `.nav.yml` for the label. Notes per folder (book-derived marked **B**, gap marked **G**):

| Folder | Notes |
|---|---|
| Foundations | How Business Works (B: Personal MBA, the five parts of a business, mental models); What an MBA Teaches (B: Harvard Business School book, case method, what such programmes do and miss) |
| Strategy | Good Strategy (B: Rumelt, kernel of diagnosis / guiding policy / coherent action, bad-strategy signs); Seven Powers (B: Helmer); Deciding Under Uncertainty (B: Thinking in Bets, resulting, probabilistic thinking, pre-mortems) |
| Finance | Reading the Numbers (B: Financial Intelligence); Cash Allocation (B: Profit First); Accounting Basics (G); Corporate Finance and Valuation (G); South African Tax and Compliance (G) |
| Marketing | Positioning (B: Obviously Awesome); Customer Conversations (B: The Mom Test); Marketing Fundamentals (G: segmentation, targeting, the 4Ps, funnel metrics) |
| Sales and Negotiation | Consultative Selling (B: SPIN); Tactical Negotiation (B: Never Split the Difference); Trust and Advisory Relationships (B: The Trusted Advisor) |
| Pricing | Value-Based Pricing (B: Weiss, Enns); Packaging and Proposals (B + G where a book is silent) |
| Operations and Management | Managerial Output (B: High Output Management); Running on Systems (B: E-Myth); Operating Rhythm (B: Traction); Building a Business That Sells (B: Built to Sell); Operations Basics (G) |
| People | Hiring (B: Who); Leadership and Organisational Behaviour (G) |
| Economics and Innovation | Economics Essentials (G); Innovation and Entrepreneurship (G: lean-startup and disruption ideas, with pointers to the primary sources) |

Names and the split of notes are the builder's to refine if a book's content clearly asks for it, keeping subject filing. A book may feed more than one note (Thinking in Bets could also be linked from Strategy and Finance); link between notes rather than duplicating.

## 7. Per-note template

1. `# NN. Title`
2. One-line scope.
3. Credit callout: `> **Based on:** *Title* by Author (year). [Bookshop](...)`. Gap notes use the "Not from the library" callout instead.
4. "At a glance" table of the frameworks in the note: name, one line, **use it when**.
5. Body sections per framework: what it is, how it works, a worked generic example, common mistakes.
6. At least one Mermaid diagram where a flow, cycle or hierarchy exists, and none where it adds nothing.
7. "Recall" block: 3 to 5 questions with the answers hidden inside `??? note "Answer"` admonitions only if the build supports them (check in the first batch); otherwise answers listed beneath in one line each.
8. "Links" to related notes in the section and other vault notes (for example pricing links to Cloud cost management where genuinely related).

## 8. Writing and sourcing method

1. Extract text to the **session scratchpad**, never into the repo: `pdftotext -layout`, EPUB via `unzip` then strip tags. Read inside chapters, not just the contents page; take the author's actual framework names and steps.
2. Work one subject batch at a time (books of one subject read together so the notes cross-reference sensibly), then write, then self-check against the text.
3. Write in own words. No chapter-order retelling. Short key terms (framework names) are fine to name; sentences are not copied.
4. ISBNs: take each from the book's copyright page, then confirm the bookshop.org page exists for that ISBN before linking. Filenames give ISBNs for some books; the rest come from the books themselves. Never guess one.
5. Gap material: web search at write time, official sources for South African items, record "as of" dates.
6. Parallel subagents per subject batch are an option to speed this up; they inherit these rules. This needs Sharif's okay at implementation time.

## 9. Site integration (do together with the notes)

- `Collection/.nav.yml`: add `- Business: 12. Business` after Books.
- `Collection/12. Business/.nav.yml` and one per sub-folder with the plain labels.
- `Collection/Whats New.md`: add a **Business** section in the existing style (one bullet per subject folder).
- `Collection/11. Books/`: add `6. Business and Management.md` (reading list with bookshop links, same table format as its siblings) and link it from `1. Start Here.md`. Heading `# 06. ...`.
- Check `index.md` / `About.md` for any list of sections that needs the new one.
- Visibility: decided in section 11 below.

## 10. Verification

- Build in a scratch venv (`pip install -r requirements.txt && zensical build -d ...`), serve it, and use agent-browser to open each new page: confirm title and numbering in the side menu, that every Mermaid block renders, tables and admonitions look right, and links resolve. Fix, rebuild, repeat.
- Grep new notes for `<br`, `quadrantChart`, `mindmap`, `.pdf`, `z-lib`, `annas-archive`, `1lib`, and local path fragments: all must be absent.
- Source check: for each book-derived note, a second pass compares the note against the extracted text for any wrong or invented claim.
- Report honestly if anything could not be verified (the vault's build is slow on the USB drive).

## 11. Visibility: decided

**Public** (Sharif, 2026-11-02: "assume public for now"). Revisit later if he changes his mind; switching to private only changes the exclusion step in section 9.

Options that were considered: **Public or private?** The rest of the vault is public except `DevBridge` (excluded from the site). Options: (a) public like the technical notes (recommended default: own-words notes with credit, same as the book-derived system design notes); (b) kept in the repo but excluded from the site, like DevBridge. It changes only the exclusion step in section 9. Until he answers, the plan assumes (a).

## 12. Left to the builder

Exact note splits within the table in section 6, diagram choices, example wording, and the order of batches (suggested: Foundations, Strategy, Finance, then Sales and Pricing, then Operations and People, then gap notes, then the cheat sheet and Start Here last, since they summarise everything).
