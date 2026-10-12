# coursework

Content and software for **AI Without the Sales Pitch**, a plain-language AI education product for small and medium businesses (Australian English, no hype).

## What is in here

| Directory | Contents |
|---|---|
| `ai-without-the-sales-pitch/` | The written content package: series overview, six full class scripts (description, outline, myth to bust, exercise, glossary), the ten ready-to-use SMB documents, facilitator notes, and research notes with sources. |
| `course-site/` | The sellable self-paced web course: static HTML + vanilla JS single-page app for Netlify (Identity for accounts, Functions + Blobs for codes/progress/Q&A, Forms for question emails), Stripe checkout with access codes, quizzes, worksheets, personalised document downloads, printable certificate, and a token-protected admin Q&A inbox. |
| `course-site/previews/` | Ten screenshots of the course UI, rendered from the real code by `course-site/tools/screenshots.cjs`. |

## Quick start

- **Read the content:** start at `ai-without-the-sales-pitch/README.md`.
- **Run or deploy the course:** follow `course-site/DEPLOY.md` (branding, Stripe, Netlify Identity, environment variables, admin inbox).
- **Edit course text:** change `course-site/content-src/*.md`, then `python3 course-site/tools/build_content.py`.
- **Test the UI:** `cd course-site && npm install --no-save jsdom && node tools/smoke_test.cjs`.
- **Regenerate screenshots:** `cd course-site && npm install --no-save playwright && npx playwright install chromium && node tools/screenshots.cjs`.

## Status of time-sensitive material

Pricing, plan names, data-handling policies and Privacy Act dates inside Documents 5 and 6 were verified on **13 October 2026** and carry quarterly review reminders in the text itself.

Everything here is practical guidance, not legal advice.
