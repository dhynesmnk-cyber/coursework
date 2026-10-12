/* smoke_test.js — renders the real index.html + scripts in jsdom and
 * checks the signed-out landing and the signed-in course views.
 * Run: node tools/smoke_test.js   (requires: npm install --no-save jsdom)
 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require(path.join(__dirname, "..", "node_modules", "jsdom"));

const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

let failures = 0;
function check(name, cond) {
  if (cond) console.log("  PASS " + name);
  else { failures++; console.log("  FAIL " + name); }
}

function makeDom(opts = {}) {
  const dom = new JSDOM(read("index.html"), {
    url: "http://localhost/",
    runScripts: "dangerously",
    pretendToBeVisual: true,
  });
  const w = dom.window;
  // jsdom does not implement scrollTo; stub it.
  w.scrollTo = () => {};
  // Load the local scripts in the same order index.html does.
  for (const f of ["assets/js/config.js", "assets/js/content.js", "assets/js/quizzes.js", "assets/js/md.js"]) {
    w.eval(read(f));
  }
  if (!opts.demo) w.eval("window.COURSE_CONFIG.demoMode = false;");
  return { dom, w };
}

function bootApp(w) {
  w.eval(read("assets/js/app.js"));
  w.document.dispatchEvent(new w.Event("DOMContentLoaded", { bubbles: true }));
}

const tick = () => new Promise((r) => setTimeout(r, 60));

(async () => {
  // ── 1. Signed-out landing ────────────────────────────────────────────
  console.log("Signed-out landing:");
  {
    const { w } = makeDom();
    bootApp(w);
    await tick();
    const html = w.document.querySelector("#app").innerHTML;
    check("hero title rendered", html.includes("AI Without the Sales Pitch"));
    check("six classes listed", (html.match(/<strong>Class \d/g) || []).length === 6);
    check("ten docs listed", (html.match(/doc-pill/g) || []).length >= 10);
    check("pricing cards present", html.includes("Whole business") && html.includes("Individual"));
    check("no [object Object] leaks", !html.includes("[object Object]"));
    w.close();
  }

  // ── 2. Signed-in course views ────────────────────────────────────────
  console.log("Signed-in views:");
  {
    const { w } = makeDom();

    const fakeUser = { id: "user-123", email: "sam@example.com" };
    const handlers = {};
    w.netlifyIdentity = {
      on: (evt, cb) => { handlers[evt] = cb; },
      currentUser: () => fakeUser,
      open: () => {},
      logout: () => {},
    };

    // fetch stub for the functions
    w.fetch = async (url, opts) => {
      const body = (o) => ({
        ok: true, status: 200,
        text: async () => JSON.stringify(o),
      });
      if (String(url).includes("access") && (!opts || opts.method !== "POST")) {
        return body({ tier: "individual", learnerName: "Sam Test", businessName: "Test Plumbing Pty Ltd" });
      }
      if (String(url).includes("access")) return body({ ok: true });
      if (String(url).includes("progress") && (!opts || opts.method !== "POST")) {
        return body({ lessons: { c0: { completed: 1 } }, quizzes: { c0: { score: 5, passed: true, at: 1 } }, worksheets: {}, qaSeen: {} });
      }
      if (String(url).includes("progress")) return body({ ok: true });
      if (String(url).includes("qa")) {
        return body({ threads: [{ key: "qa/user-123/1", userId: "user-123", email: "sam@example.com", question: "Should we buy Claude Team seats or rely on Workspace Gemini?", lesson: "Class 3", createdAt: 1, replies: [{ text: "Business tier, every time.", at: 2 }] }] });
      }
      return body({});
    };

    bootApp(w);
    if (handlers.init) handlers.init(fakeUser);
    await tick(); await tick();

    const app = () => w.document.querySelector("#app").innerHTML;

    check("dashboard greets learner", app().includes("Welcome back, Sam"));
    check("dashboard shows tier", app().includes("individual"));
    check("sidebar shows 1/6 completed badge", app().includes('badge">1/6'));

    // class view
    w.location.hash = "#/class/0";
    await tick();
    check("class 1 lesson renders prose", app().includes("a stack of billions of numbers") || app().includes("stack of numbers"));
    check("class 1 has tabs", app().includes('data-tab="lesson"') && app().includes('data-tab="quiz"'));
    check("mark-complete shows done state", app().includes("Completed"));
    check("quiz has five questions", (app().match(/class="quiz-q"/g) || []).length === 5);

    // worksheet view tab exists with fields
    check("worksheet fields rendered", (app().match(/data-field="/g) || []).length >= 6);

    // doc view with personalisation
    w.location.hash = "#/doc/2"; // shadow AI policy
    await tick();
    check("doc personalised with business name", app().includes("Test Plumbing Pty Ltd"));
    check("no leftover [Business Name] in personalised doc", !app().includes("[Business Name]"));
    check("doc has print + download buttons", app().includes("doc-print") && app().includes("doc-download"));

    // comparison matrix doc: tables survive
    w.location.hash = "#/doc/5";
    await tick();
    check("matrix doc renders a table", app().includes("<table>"));

    // qa inbox
    w.location.hash = "#/qa";
    await tick();
    check("qa shows stored thread", app().includes("Should we buy Claude Team seats"));
    check("qa shows owner reply", app().includes("Business tier, every time"));

    // certificate (only 1 of 6 quizzes passed in stub progress)
    w.location.hash = "#/certificate";
    await tick();
    check("certificate locked state shows progress", app().includes("1 of 6"));

    // profile
    w.location.hash = "#/profile";
    await tick();
    check("profile prefilled", app().includes('value="Test Plumbing Pty Ltd"'));

    w.close();
  }

  // ── 3. Preview (demo) mode, no Identity, no Stripe ────────────────────
  console.log("Preview mode:");
  {
    const { w } = makeDom({ demo: true });
    bootApp(w);
    await tick(); await tick();
    const app = () => w.document.querySelector("#app").innerHTML;
    check("hero offers Start the course", app().includes("Start the course"));
    check("no Stripe buy button in hero", !app().includes(">Buy access<"));
    check("preview note shown", app().includes("open preview"));
    w.location.hash = "#/learn";
    await tick();
    check("dashboard reachable with no account", app().includes("Welcome back"));
    check("preview tier shown", app().includes("preview"));
    w.location.hash = "#/qa";
    await tick();
    check("qa sending disabled with explanation", app().includes("Preview mode: question sending is switched off"));
    check("send button disabled", app().includes("disabled"));
    w.close();
  }

  console.log(failures ? "\n" + failures + " FAILURES" : "\nAll smoke tests passed.");
  process.exit(failures ? 1 : 0);
})();
