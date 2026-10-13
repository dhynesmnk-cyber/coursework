# coursework

Content and software for **AI Without the Sales Pitch**, a plain-language AI education product for small and medium businesses (Australian English, no hype).

## What is in here

| Directory | Contents |
|---|---|
| `ai-without-the-sales-pitch/` | The written content package: series overview, six learner-facing class chapters (outcomes, plain-language teaching, myth section, solo exercise, word list), the ten ready-to-use SMB documents, facilitator notes, registration blurbs, and research notes with sources. |
| `course-site/` | The sellable self-paced web course: static HTML + vanilla JS single-page app for Netlify (Identity for accounts, Functions + Blobs for codes/progress/Q&A, Forms for question emails), Stripe checkout with access codes, quizzes, worksheets, personalised document downloads, printable certificate, and a token-protected admin Q&A inbox. |
| `course-site/` Tools section | Six free, public add-on tools at `#/tools`, each tied to the class or document it puts into practice: Blog Writer, Product-Shot Prompt Builder and BeeSearch Leads (Claude, run as Netlify background jobs behind daily spend caps), plus Website Check, Instagram Follower Sorter and AI Cost Check (no AI). These replace the separate Bee Free Tools site and the Replit-hosted BeeSearch app. See section 11 of `course-site/DEPLOY.md`. |
| `course-site/previews/` | Screenshots of the course UI and tools, rendered from the real code by `course-site/tools/screenshots.cjs`. |

## Quick start

- **Read the content:** start at `ai-without-the-sales-pitch/README.md`.
- **Run or deploy the course:** follow `course-site/DEPLOY.md` (branding, Stripe, Netlify Identity, environment variables, admin inbox).
- **Edit course text:** change `course-site/content-src/*.md`, then `python3 course-site/tools/build_content.py`.
- **Test:** `cd course-site && npm install && npm install --no-save jsdom && node tools/smoke_test.cjs && node tools/test_tools.mjs` (UI in jsdom, then the functions against a local Netlify Blobs server and the tools' logic).
- **Regenerate screenshots:** `cd course-site && npm install --no-save playwright && npx playwright install chromium`, start a local server with `python3 -m http.server 8137`, then `node tools/screenshots.cjs`.

## Status of time-sensitive material

Pricing, plan names, data-handling policies and Privacy Act dates inside Documents 5 and 6 were verified on **13 October 2026** and carry quarterly review reminders in the text itself.

Everything here is practical guidance, not legal advice.
