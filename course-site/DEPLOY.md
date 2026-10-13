# DEPLOY.md — Launch guide for "AI Without the Sales Pitch" (self-paced edition)

Everything runs on Netlify's own building blocks: static hosting, **Identity** (registration/sign-in), **Functions** (the small API), **Blobs** (storage for codes, progress, Q&A and tool jobs) and **Forms** (the email leg of the question feature). The only other services are Stripe (payments) and Anthropic (the three AI tools). Expected running cost at small-business scale: Netlify Pro (needed for the AI tools' background functions), Stripe's per-transaction fees, and Anthropic usage, which the daily caps keep to a few dollars a day at most (see section 11).

---

## 0. Preview mode (accounts and payments switched off)

One flag controls it: `demoMode` at the top of `assets/js/config.js`.

- `demoMode: true` (current): open preview. No sign-in, no Stripe. Every visitor walks straight in from the homepage ("Start the course"), progress and profile save to the browser's local storage only, question sending is disabled with an on-screen explanation, and a "Preview mode" chip shows in the top bar so nobody mistakes it for the live product.
- `demoMode: false`: live mode. Netlify Identity sign-in, Stripe checkout and access codes, server-side progress, working Q&A inbox.

Flip the flag and redeploy; nothing else changes. Use preview mode for showing the course to prospects, and live mode once your Stripe links and environment variables are configured.

---

## 1. Brand the course (2 minutes)

Edit `assets/js/config.js`:

- `brand.sellerName` — your business name (header, certificate, Q&A replies).
- `brand.supportEmail` — shown to learners for purchase problems.
- `brand.logo` — optional path to an SVG/PNG.
- `colors.primary` / `colors.accent` — any CSS colours.
- `stripe.individualPrice` / `stripe.businessPrice` — display prices on the landing page (e.g. `"A$99"`, `"A$349"`).

## 2. Deploy the site

**Option A (recommended): connect the GitHub repo.** In Netlify: Add new site → Import an existing project → your repo. The root `netlify.toml` already sets `base = "course-site"`, installs the function dependencies and publishes from the right folder, so default settings work. Two gotchas:

1. **UI settings override the config file.** If the site was created with a publish directory or base directory typed into the UI, those win over `netlify.toml`. For this repo the correct values are: Base directory `course-site`, Build command `npm install`, Publish directory `.` (relative to base). If you see a 404 on the site root with an otherwise successful deploy, this is almost always the cause: the site is publishing the repo root, which has no `index.html` because the course lives in `course-site/`.
2. **Environment variables (step 5) must exist before the first deploy that uses Stripe functions.** A deploy without them still serves the site; only code issuance and the admin inbox will error until they are set.

**Option B (drag and drop, static only):** app.netlify.com → Add new site → "Deploy manually" → drag the `course-site` folder in. Caveat: serverless functions need their dependencies bundled, which drag-and-drop does not do; use this only to preview the UI, or run `netlify deploy` from the CLI inside `course-site` after `npm install` so functions bundle properly.

**Option C (git, manual remote):** push this folder to any repo and set Base directory `course-site` in the UI if the root `netlify.toml` is not at the repo root.

Netlify installs the function dependencies (`@netlify/blobs`, `stripe`) from `course-site/package.json` during the build command.

## 3. Enable sign-up / sign-in (Netlify Identity)

Site configuration → Identity → **Enable Identity**. Registration: "Open" (invite-only also works if you prefer to create accounts yourself). Email confirmation: your choice; turning it **off** reduces friction for shared business-tier logins, turning it **on** keeps emails verified. The sign-up/login modal is already wired into the site.

## 4. Create the two Stripe products and payment links

In Stripe dashboard → Products, create:

1. **Individual licence** — one-time price, e.g. A$99.
2. **Whole-business licence** — one-time price, e.g. A$349.

Then Payment Links → create a link for each. In each link's settings set the **confirmation page (success URL)** to:

```
https://YOUR-SITE.netlify.app/?session_id={CHECKOUT_SESSION_ID}
```

(keep the `{CHECKOUT_SESSION_ID}` placeholder exactly; Stripe fills it in). For Australian sales, set your tax/GST handling in Stripe's tax settings and price GST-inclusive if that's how you advertise.

## 5. Set environment variables

Site configuration → Environment variables:

| Variable | Value |
|---|---|
| `STRIPE_SECRET_KEY` | your Stripe secret key (`sk_live_...` or `sk_test_...` to start) |
| `STRIPE_PRICE_INDIVIDUAL` | the Individual **price ID** (`price_...`) from the product page — comma-separate several if you re-price later |
| `STRIPE_PRICE_BUSINESS` | the Business **price ID** (`price_...`) |
| `ADMIN_TOKEN` | a long random string you invent (e.g. output of `openssl rand -hex 24`). This protects `/admin.html`. |
| `ANTHROPIC_API_KEY` | your Anthropic API key, for the three AI tools. Without it those tools show a "not switched on yet" note plus an example output; everything else works. |

Optional: `STRIPE_BUSINESS_MIN_AMOUNT` — fallback tier detection in cents (default `10000` = $100) if a price ID is ever misconfigured; a paid session at or above that amount issues a business code. The tools have their own optional variables, listed in section 11.

Give each variable the **Functions** scope (or "All scopes"). The functions read them at run time, so a change takes effect on the next deploy.

Redeploy after setting these. Then paste the two Payment Link URLs into `config.js` (`stripe.individualLink`, `stripe.businessLink`).

**How a sale works:** buyer pays → Stripe redirects them back with a session ID → the `issue-code` function verifies the payment server-side and shows the buyer an access code (also stored against the session, so reloading can't double-issue) → buyer creates an account (or signs in) and redeems the code → their account gets the `individual` or `business` tier. Lost code? Look it up by their Stripe receipt email and reissue manually (or just give them a fresh one from the admin mindset — codes are single-use but you control issuance).

## 6. Question emails (Netlify Forms)

The Q&A has two legs. The **storage leg** (functions + blobs) makes replies appear in the learner's course. The **email leg** uses Netlify Forms so *you* get pinged: Site configuration → Forms → set the **notification email** (Form notifications → "Notify on new submissions", default is the owner email). Free plan allowance is 100 submissions/month; upgrade or add an email API in `qa.js` if you outgrow it.

The hidden forms in `index.html` (`course-question` for questions, `custom-build` for custom-version enquiries from the tool pages) are what Netlify detects at deploy time. **Newer Netlify projects have form detection switched off:** open the project's **Forms** page, click **Enable form detection**, then redeploy, or submissions are silently dropped. Don't rename `course-question` without also renaming `netlifyFormName` in `config.js`.

## 7. Answering questions (your admin inbox)

Visit `https://YOUR-SITE/admin.html`, enter your `ADMIN_TOKEN`. You'll see every learner question with their email, the lesson context, and a reply box. Replies support simple Markdown, appear in the learner's course on their next page visit or within ~45 seconds if they're sitting on the Q&A screen, and a toast pops for them ("New reply on one of your questions"). Learners are not emailed about replies by default (no email provider needed); there's a marked hook in `admin-qa.js` if you later want to add Resend/Postmark notifications.

## 8. Test before you sell

1. Use Stripe **test mode** keys and a test card (`4242 4242 4242 4242`) to buy both tiers end-to-end: code issuance, sign-up, redemption, dashboard.
2. Ask a question as the test learner; answer it in `/admin.html`; confirm it appears in the learner session.
3. Fill the profile (business name), download Document 3, confirm the templates come out with the business name pre-filled.
4. Pass all six quizzes on a test account and print the certificate.
5. Local preview of the UI only: `python3 -m http.server` in this folder (functions won't run locally without `netlify dev`; for full local testing: `npm i -g netlify-cli && netlify login && netlify link && netlify dev`). Without functions, the AI tools fall back to their example output and Website Check to its paste-the-HTML mode.
6. Automated tests, run from this folder after `npm install && npm install --no-save jsdom`:
   - `node tools/smoke_test.cjs`: the real `index.html` and scripts in jsdom (landing, lessons, quizzes, worksheets, personalisation, Q&A, certificate, profile, and every tool page including the AI job flow with a stubbed backend).
   - `node tools/test_tools.mjs`: the Netlify functions run against a local Netlify Blobs server (sign-in, progress, Q&A, codes, the tool job runner with a stubbed Claude client, the spend caps, the safe fetcher) plus the tools' pure logic (robots.txt rules, structured-data scoring, Instagram export parsing, cost maths).
7. Tools, after deploying with `ANTHROPIC_API_KEY` set: run each AI tool once (Blog Writer, Product-Shot Prompt Builder with and without a photo, BeeSearch Leads, then "Write a pitch" on a saved lead), run Website Check on your own site, and confirm in the Netlify dashboard (Blobs, store `course`) that `tools/usage/...` keys appear. Then set `TOOLS_PER_VISITOR_DAILY=1`, redeploy, and confirm your second run is politely refused.

## 9. Updating content later

The course text lives in `content-src/*.md` (the same files as the original content package). Edit them, then:

```
python3 tools/build_content.py
```

That regenerates `assets/js/content.js`. Redeploy. Quizzes and worksheets are hand-maintained in `assets/js/quizzes.js`. **Remember the staleness rule from the source material:** Documents 5 and 6 (data security, comparison matrix) carry "last verified" dates and need a quarterly refresh; the course shows buyers they get refreshes for life, so diary it.

## 10. Known limits and upgrade paths

- **Netlify Identity free tier** covers ~50k monthly active users; you'll hit the paid tier long after this course is a success story.
- **Forms allowance** 100/month free: at $ per question that's a healthy course; upgrade path is Netlify Pro or an email API inside `qa.js`.
- **Shared business-tier login** is by design (per your tier choice). Progress is per-account, so a shared login shares progress; that's accepted for team licences. If you later want per-person seats inside a business, the blob layout (`users/{id}`, `progress/{id}`) extends to an `orgId` cleanly.
- **Blobs** have no expiry; storage of codes/progress/Q&A at this scale is negligible. Tool jobs are deleted as soon as the result is collected, and usage counters older than a week are pruned automatically.
- **No community, by design.** Q&A is one-to-one between you and each learner, as specced.

## 11. The Tools section (public add-ons)

Six small tools sit at `#/tools`, open to everyone with no account. Each one links to the class or document it goes with, and those class and document pages link back with a "Try it with a free tool" box. Learners see them inside the course layout; visitors see a public page with a link to the course.

| Tool | Runs on | Cost per use |
|---|---|---|
| Blog Writer, step 1: reads the visitor's website (homepage plus up to two about/services pages), works out their business details and suggests topics using web search | Claude with Anthropic's built-in web search | about 10 to 25 cents |
| Blog Writer, step 2: writes the post on the picked topic (or skip step 1 and type the details in) | Claude (background job) | about 5 to 10 cents on Claude Opus 5.5 |
| Product-Shot Prompt Builder | Claude (background job), optional photo shrunk in the browser | about 2 cents |
| BeeSearch Leads, plus "Write a pitch" | Claude with Anthropic's built-in web search | about 15 to 30 cents a search (search results are long, and each web search is billed on top); pitches about 2 cents |
| Website Check | the `site-check` function, no AI | nothing |
| Instagram Follower Sorter | the visitor's browser only | nothing |
| AI Cost Check | the visitor's browser only | nothing |

Costs are estimates; check Anthropic's pricing page for current rates.

**Needs Netlify Pro.** The AI tools run as background functions (`tool-run-background`), which Netlify offers on Pro and above. They get up to 15 minutes, so a long post or a web search never hits the normal 30-second function limit. The browser starts the job, then checks `tool-status` every few seconds and shows the result when it's ready.

**Spend guard.** No login is needed, so every AI run counts against two daily caps (reset at midnight Sydney time), stored in Blobs:

| Variable | Default | What it does |
|---|---|---|
| `TOOLS_DAILY_LIMIT` | `30` | AI runs per day across the whole site |
| `TOOLS_PER_VISITOR_DAILY` | `5` | AI runs per day per visitor (a salted hash of their IP; no raw IP is stored) |
| `TOOLS_AI_ENABLED` | `true` | set to `false` to pause all AI tools instantly (after a redeploy) |
| `CLAUDE_MODEL` | `claude-opus-5-5` | the Claude model. `claude-haiku-5-5` is much cheaper and faster, at some cost in writing quality. |

Each Blog Writer step counts as one run, so a post written from a website uses two. Failed runs aren't counted. When a cap is hit or the AI is paused, the tool shows a friendly note plus its built-in example, so the showcase still works. At the default caps the worst case is about $5 a day on Opus 5.5. As a second safety net, set a monthly spend limit for the API key in the Anthropic Console.

**What's stored.** The job (input and result) sits in Blobs only until the browser collects it, then it's deleted. The usage counters hold a timestamp and nothing else. The Leads shortlist, notes and pitches live only in the visitor's own browser. Inputs are sent to Anthropic to generate the result.

**Refusals.** On Opus 5.5 the tools ask Anthropic to re-run a request on a fallback model if Claude declines it (the API's server-side fallback, `fallbacks: "default"`). If everything declines, the visitor sees a plain message asking them to reword.

**"Want a version built for your business?"** A small box at the foot of every tool page (and the tools gallery) invites visitors to ask about a custom build. The name it shows comes from `customBuild.name` in `assets/js/config.js` (currently "Dave"). Enquiries go to the Netlify Form `custom-build` (name, email, which tool, what they'd want), so they arrive by email once Forms notifications are on (section 6) and count toward the same Forms allowance as course questions. Optional: set `customBuild.email` to show an address if the form ever fails to send.

**Adding a tool.** Write `assets/js/tools/<name>.js` that calls `COURSE_TOOLS.register({ slug, title, kind, blurb, related, render, bind })` (copy `ai-cost.js` for a browser-only tool, or `blog-writer.js` for an AI one), add its `<script>` tag to `index.html`, and for an AI tool add a module to `netlify/functions/utils/ai/` with `validate()` and `run()` and list it in `utils/ai/index.js`. The `related` slugs are the content slugs from `assets/js/content.js` (e.g. `class-4-talking-to-the-software`).

## File map

```
course-site/
├── index.html                  # landing + entire course SPA
├── admin.html                  # your question inbox (token-protected)
├── netlify.toml                # functions + publish config
├── package.json                # function dependencies
├── assets/css/styles.css       # theme (colours via config.js)
├── assets/js/config.js         # ← EDIT: branding, prices, Stripe links
├── assets/js/app.js            # SPA: routing, auth, progress, quizzes, Q&A
├── assets/js/md.js             # markdown renderer
├── assets/js/quizzes.js        # 6 quizzes + 6 worksheets (hand-edited)
├── assets/js/content.js        # GENERATED from content-src — don't edit
├── assets/js/tools/
│   ├── registry.js             # shared tool plumbing (job runner, helpers)
│   ├── blog-writer.js          # one file per tool ...
│   ├── shot-prompts.js
│   ├── leads.js
│   ├── site-audit.js           # Website Check logic (schema + robots.txt)
│   ├── website-check.js
│   ├── follower-sorter.js
│   └── ai-cost.js
├── content-src/*.md            # the course text (edit here, rebuild)
├── netlify/functions/
│   ├── issue-code.js           # Stripe success → access code
│   ├── redeem-code.js          # code → account tier
│   ├── access.js               # licence + profile (personalisation data)
│   ├── progress.js             # lessons/quizzes/worksheets per learner
│   ├── qa.js                   # learner questions + replies store
│   ├── admin-qa.js             # your inbox API (ADMIN_TOKEN)
│   ├── tool-run-background.js  # runs one AI tool job (background, 15 min)
│   ├── tool-status.js          # the browser polls this for the result
│   ├── site-check.js           # fetches a page + robots.txt for Website Check
│   └── utils/
│       ├── helpers.js          # blobs, identity, JSON helpers
│       ├── claude.js           # model, effort, refusal fallback, errors
│       ├── limits.js           # daily caps + kill switch
│       ├── safe-fetch.js       # public-internet-only page fetcher
│       └── ai/                 # one module per AI tool (prompt + schema)
└── tools/
    ├── build_content.py        # markdown → content.js
    ├── smoke_test.cjs          # UI test in jsdom
    ├── test_tools.mjs          # functions + tool logic tests
    └── screenshots.cjs         # regenerates previews/
```
