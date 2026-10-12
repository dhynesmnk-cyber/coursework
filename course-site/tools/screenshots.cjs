/* screenshots.cjs — renders static preview shots of the course UI.
 * Run: node tools/screenshots.cjs  (requires: npm install --no-save playwright)
 * Output: previews/*.png
 */
const path = require("path");
const fs = require("fs");
const { chromium } = require(path.join(__dirname, "..", "node_modules", "playwright"));

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "previews");
const PORT = 8137;
const BASE = `http://localhost:${PORT}/index.html`;

fs.mkdirSync(OUT, { recursive: true });

const profile = {
  tier: "individual",
  learnerName: "Sam Nguyen",
  businessName: "Nguyen Plumbing Pty Ltd",
};

const progressPart = {
  lessons: { c0: { completed: 1 }, c1: { completed: 1 }, c2: { completed: 1 } },
  quizzes: { c0: { score: 5, passed: true, at: 1 }, c1: { score: 4, passed: true, at: 1 } },
  worksheets: { c0: { task: "Draft a reminder email for the 30-day overdue Bayside Dental invoice" } },
  qaSeen: {},
};

const progressAll = {
  lessons: { c0: { completed: 1 }, c1: { completed: 1 }, c2: { completed: 1 }, c3: { completed: 1 }, c4: { completed: 1 }, c5: { completed: 1 } },
  quizzes: { c0: { score: 5, passed: true, at: 1 }, c1: { score: 5, passed: true, at: 1 }, c2: { score: 4, passed: true, at: 1 }, c3: { score: 5, passed: true, at: 1 }, c4: { score: 4, passed: true, at: 1 }, c5: { score: 5, passed: true, at: 1 } },
  worksheets: {},
  qaSeen: {},
};

const threads = [
  {
    key: "qa/u1/1", userId: "u1", email: "sam@example.com",
    question: "We're a 12-person bookkeeping firm on Google Workspace. Is the bundled Gemini enough for client documents, or should we add Claude Team seats?",
    lesson: "Class 3: Your Data, Their Servers", createdAt: Date.now() - 86400000,
    replies: [{ text: "Short answer: the Workspace bundle covers day-to-day drafting safely, because business-tier Workspace prompts are not used to train models outside your domain. For long client documents (30+ page reports, multi-year comparatives), a Claude Team pilot is worth it: Projects keep each client's material in its own workspace, and long-document handling is its strong suit. My suggestion: run one month with both on a single client's material and compare the checking time, not the wow factor.", at: Date.now() - 43200000 }],
  },
];

function initScript(data) {
  return `
    window.__h = {};
    window.netlifyIdentity = {
      on: (e, cb) => { window.__h[e] = cb; },
      currentUser: () => null,
      open: () => {},
      logout: () => {},
    };
    const DATA = ${JSON.stringify(data)};
    try {
      localStorage.setItem("awspp-progress-demo", JSON.stringify(DATA.progress));
      localStorage.setItem("awspp-demo-access", JSON.stringify(DATA.access));
    } catch (e) {}
    window.fetch = async (url, opts) => {
      const u = String(url);
      const body = (o) => ({ ok: true, status: 200, text: async () => JSON.stringify(o) });
      if (u.includes("access")) return body(DATA.access);
      if (u.includes("progress")) return body(DATA.progress);
      if (u.includes("/qa")) return body({ threads: DATA.threads || [] });
      return body({});
    };`;
}

async function newPage(browser, { authed = false, progress = progressPart } = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 940 },
    deviceScaleFactor: 2,
  });
  // Block the external identity widget; fonts are allowed through.
  await ctx.route("**://identity.netlify.com/**", (r) => r.abort());
  const page = await ctx.newPage();
  if (authed) {
    await page.addInitScript(initScript({ access: profile, progress, threads }));
  }
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  return { ctx, page };
}

async function signIn(page) {
  // Preview mode boots straight into a synthetic signed-in session.
  await page.waitForSelector(".sidebar, .hero", { timeout: 5000 });
  await page.waitForTimeout(400);
}

async function shot(page, name, opts = {}) {
  const p = path.join(OUT, name + ".png");
  await page.screenshot({ path: p, ...opts });
  console.log("saved", p);
}

(async () => {
  const browser = await chromium.launch();

  // 1. Landing hero
  {
    const { page, ctx } = await newPage(browser);
    await shot(page, "01-landing-hero");
    await ctx.close();
  }

  // 2. How-it-works band + curriculum
  {
    const { page, ctx } = await newPage(browser);
    await page.locator(".band-dark").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await shot(page, "02-landing-how-it-works");
    await ctx.close();
  }

  // 3. Pricing
  {
    const { page, ctx } = await newPage(browser);
    await page.locator("#buy").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await shot(page, "03-landing-pricing");
    await ctx.close();
  }

  // 4. Dashboard (signed in)
  {
    const { page, ctx } = await newPage(browser, { authed: true });
    await signIn(page);
    await shot(page, "04-dashboard");
    await ctx.close();
  }

  // 5. Class lesson
  {
    const { page, ctx } = await newPage(browser, { authed: true });
    await signIn(page);
    await page.evaluate(() => { location.hash = "#/class/0"; });
    await page.waitForSelector(".prose h3", { timeout: 5000 });
    await page.waitForTimeout(300);
    await shot(page, "05-lesson");
    await ctx.close();
  }

  // 6. Quiz tab
  {
    const { page, ctx } = await newPage(browser, { authed: true });
    await signIn(page);
    await page.evaluate(() => { location.hash = "#/class/2"; });
    await page.waitForSelector(".prose", { timeout: 5000 });
    await page.locator('.tab[data-tab="quiz"]').click();
    await page.waitForTimeout(300);
    await shot(page, "06-quiz");
    await ctx.close();
  }

  // 7. Document view (personalised, code blocks)
  {
    const { page, ctx } = await newPage(browser, { authed: true });
    await signIn(page);
    await page.evaluate(() => { location.hash = "#/doc/0"; });
    await page.waitForSelector(".prose pre", { timeout: 5000 });
    await page.waitForTimeout(300);
    await shot(page, "07-document");
    await ctx.close();
  }

  // 8. Comparison matrix doc (tables)
  {
    const { page, ctx } = await newPage(browser, { authed: true });
    await signIn(page);
    await page.evaluate(() => { location.hash = "#/doc/5"; });
    await page.waitForSelector(".prose table", { timeout: 5000 });
    await page.waitForTimeout(300);
    await shot(page, "08-matrix-table");
    await ctx.close();
  }

  // 9. Q&A inbox with a reply
  {
    const { page, ctx } = await newPage(browser, { authed: true });
    await signIn(page);
    await page.evaluate(() => { location.hash = "#/qa"; });
    await page.waitForSelector(".demo-note", { timeout: 5000 });
    await page.waitForTimeout(300);
    await shot(page, "09-qa-inbox");
    await ctx.close();
  }

  // 10. Certificate (all quizzes passed)
  {
    const { page, ctx } = await newPage(browser, { authed: true, progress: progressAll });
    await signIn(page);
    await page.evaluate(() => { location.hash = "#/certificate"; });
    await page.waitForSelector(".cert-preview", { timeout: 5000 });
    await page.waitForTimeout(300);
    await shot(page, "10-certificate");
    await ctx.close();
  }

  await browser.close();
  console.log("done");
})();
