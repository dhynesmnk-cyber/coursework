# DEPLOY.md — Launch guide for "AI Without the Sales Pitch" (self-paced edition)

Everything runs on Netlify's own building blocks: static hosting, **Identity** (registration/sign-in), **Functions** (the small API), **Blobs** (storage for codes, progress and Q&A) and **Forms** (the email leg of the question feature). No other services except Stripe. Expected running cost at small-business scale: **$0/month** on Netlify's free plan plus Stripe's per-transaction fees.

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

Optional: `STRIPE_BUSINESS_MIN_AMOUNT` — fallback tier detection in cents (default `10000` = $100) if a price ID is ever misconfigured; a paid session at or above that amount issues a business code.

Redeploy after setting these. Then paste the two Payment Link URLs into `config.js` (`stripe.individualLink`, `stripe.businessLink`).

**How a sale works:** buyer pays → Stripe redirects them back with a session ID → the `issue-code` function verifies the payment server-side and shows the buyer an access code (also stored against the session, so reloading can't double-issue) → buyer creates an account (or signs in) and redeems the code → their account gets the `individual` or `business` tier. Lost code? Look it up by their Stripe receipt email and reissue manually (or just give them a fresh one from the admin mindset — codes are single-use but you control issuance).

## 6. Question emails (Netlify Forms)

The Q&A has two legs. The **storage leg** (functions + blobs) makes replies appear in the learner's course. The **email leg** uses Netlify Forms so *you* get pinged: Site configuration → Forms → set the **notification email** (Form notifications → "Notify on new submissions", default is the owner email). Free plan allowance is 100 submissions/month; upgrade or add an email API in `qa.js` if you outgrow it.

The hidden form named `course-question` in `index.html` is what Netlify detects at deploy time. Don't rename it without also renaming `netlifyFormName` in `config.js`.

## 7. Answering questions (your admin inbox)

Visit `https://YOUR-SITE/admin.html`, enter your `ADMIN_TOKEN`. You'll see every learner question with their email, the lesson context, and a reply box. Replies support simple Markdown, appear in the learner's course on their next page visit or within ~45 seconds if they're sitting on the Q&A screen, and a toast pops for them ("New reply on one of your questions"). Learners are not emailed about replies by default (no email provider needed); there's a marked hook in `admin-qa.js` if you later want to add Resend/Postmark notifications.

## 8. Test before you sell

1. Use Stripe **test mode** keys and a test card (`4242 4242 4242 4242`) to buy both tiers end-to-end: code issuance, sign-up, redemption, dashboard.
2. Ask a question as the test learner; answer it in `/admin.html`; confirm it appears in the learner session.
3. Fill the profile (business name), download Document 3, confirm the templates come out with the business name pre-filled.
4. Pass all six quizzes on a test account and print the certificate.
5. Local preview of the UI only: `python3 -m http.server` in this folder (functions won't run locally without `netlify dev`; for full local testing: `npm i -g netlify-cli && netlify login && netlify link && netlify dev`).
6. Automated smoke test: `npm install --no-save jsdom && node tools/smoke_test.cjs` (18 checks across landing, lessons, quizzes, worksheets, personalisation, Q&A, certificate, profile).

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
- **Blobs** have no expiry; storage of codes/progress/Q&A at this scale is negligible.
- **No community, by design.** Q&A is one-to-one between you and each learner, as specced.

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
├── content-src/*.md            # the course text (edit here, rebuild)
├── netlify/functions/
│   ├── issue-code.js           # Stripe success → access code
│   ├── redeem-code.js          # code → account tier
│   ├── access.js               # licence + profile (personalisation data)
│   ├── progress.js             # lessons/quizzes/worksheets per learner
│   ├── qa.js                   # learner questions + replies store
│   ├── admin-qa.js             # your inbox API (ADMIN_TOKEN)
│   └── utils/helpers.js        # blobs, identity, JSON helpers
└── tools/
    ├── build_content.py        # markdown → content.js
    └── smoke_test.cjs          # 18-check UI test
```
