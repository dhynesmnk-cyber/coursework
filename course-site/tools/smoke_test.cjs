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
  // Load the local scripts in the same order index.html does (app.js last,
  // via bootApp). Reading the list from index.html keeps the two in step.
  for (const f of LOCAL_SCRIPTS) {
    if (!f.endsWith("/app.js")) w.eval(read(f));
  }
  if (!opts.demo) w.eval("window.COURSE_CONFIG.demoMode = false;");
  return { dom, w };
}

const LOCAL_SCRIPTS = (read("index.html").match(/<script src="(assets\/js\/[^"]+)"/g) || [])
  .map((tag) => tag.match(/src="([^"]+)"/)[1]);

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

    // tools inside the course
    w.location.hash = "#/class/3";
    await tick();
    check("class 4 links to the Blog Writer", app().includes('href="#/tool/blog-writer"') && app().includes("tool-callout"));
    w.location.hash = "#/doc/3";
    await tick();
    check("doc 4 links to a tool", app().includes("tool-callout") && app().includes('href="#/tool/blog-writer"'));
    w.location.hash = "#/tools";
    await tick();
    check("signed-in tools page sits inside the course layout", app().includes('class="sidebar"') && app().includes("tool-card"));
    check("sidebar lists the tools", app().includes('class="side-link doc-link" href="#/tool/leads"'));
    w.location.hash = "#/tool/blog-writer";
    await tick();
    check("goes-with links are live for learners", app().includes('href="#/class/3"'));

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

  // ── 4. Tools, signed out (public showcase) ───────────────────────────
  console.log("Tools (signed out):");
  {
    const { w } = makeDom();
    // Fake backend for the AI job flow. jobs[] scripts what tool-status returns.
    let script = [];
    const posted = [];
    const reply = (status, o) => ({ ok: status < 400, status, json: async () => o, text: async () => JSON.stringify(o) });
    w.fetch = async (url, opts) => {
      const u = String(url);
      if (u.includes("tool-run-background")) { posted.push(JSON.parse(opts.body)); return reply(202, {}); }
      if (u.includes("tool-status")) return reply(200, script.length > 1 ? script.shift() : script[0]);
      return reply(200, {});
    };
    bootApp(w);
    w.COURSE_TOOLS.pollMs = 5;
    await tick();
    const app = () => w.document.querySelector("#app").innerHTML;
    const $ = (s) => w.document.querySelector(s);
    const waitFor = async (fn) => { for (let i = 0; i < 60 && !fn(); i++) await tick(); return fn(); };

    check("landing has a free tools band", app().includes('id="tools"') && (app().match(/tool-card/g) || []).length >= 3);
    check("landing still lists exactly six classes", (app().match(/<strong>Class \d/g) || []).length === 6);
    check("top bar links to the tools", w.document.querySelector(".topbar").innerHTML.includes('href="#/tools"'));

    w.location.hash = "#/tools";
    await tick();
    const count = w.COURSE_TOOLS.list().length;
    check("tools gallery is public", app().includes("Free tools") && (app().match(/class="card doc-card tool-card"/g) || []).length === count);
    check("public tools page has no course sidebar", !app().includes('class="sidebar"') && app().includes("course-plug"));
    for (const t of w.COURSE_TOOLS.list()) {
      w.location.hash = "#/tool/" + t.slug;
      await tick();
      check(`tool page renders: ${t.slug}`, app().includes(t.title) && $("#tool-root") && $("#tool-root").innerHTML.length > 200 && !app().includes("[object Object]"));
    }
    w.location.hash = "#/tool/blog-writer";
    await tick();
    check("goes-with box names the class (not linked while signed out)", app().includes("goes-with") && !app().includes('href="#/class/3"'));

    // Blog: client-side validation, no request sent
    $("#tool-root form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await tick();
    check("blog asks for missing fields before sending", $(".tool-output").textContent.includes("business name") && posted.length === 0);

    // Blog: full job flow
    $('[name="business"]').value = "Smith Roofing";
    $('[name="topic"]').value = "Winter roof checks";
    script = [{ status: "pending" }, { status: "running" }, { status: "done", result: { title: "Winter Roof Checks", metaDescription: "Meta here", post: "Intro.\n\n## Clear the gutters\n\nDo it in autumn." } }];
    $("#tool-root form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => $(".tool-output").innerHTML.includes("Clear the gutters"));
    check("blog job posts the right tool and input", posted[0] && posted[0].tool === "blog-writer" && posted[0].input.business === "Smith Roofing" && /^[0-9a-f-]{36}$/.test(posted[0].jobId));
    check("blog result renders the post as HTML", $(".tool-output").innerHTML.includes("<h3>Clear the gutters</h3>") && $(".tool-output").innerHTML.includes("Winter Roof Checks"));
    check("blog result has copy and download", $(".tool-output").innerHTML.includes('data-copy="#blog-md"') && $("#blog-download"));
    check("blog form remembers its inputs", (w.localStorage.getItem("awspp-blog-form") || "").includes("Smith Roofing"));

    // Daily cap reached: friendly note plus the example
    script = [{ status: "error", code: "limit", error: "You've used your 5 free runs for today." }];
    $("#tool-root form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => $(".tool-output").innerHTML.includes("Example output"));
    check("cap reached shows the message and the example", $(".tool-output").textContent.includes("5 free runs") && $(".tool-output").innerHTML.includes("Example output"));

    // Other errors: message only
    script = [{ status: "error", code: "busy", error: "The AI service is busy right now." }];
    $("#tool-root form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => $(".tool-output").textContent.includes("busy"));
    check("service errors are shown plainly", $(".tool-output").innerHTML.includes("notice-bad") && !$(".tool-output").innerHTML.includes("Example output"));

    // Example button
    $(".show-example").click();
    await tick();
    check("see-an-example works without a request", $(".tool-output").innerHTML.includes("Example output"));

    // Leads: search, shortlist, status, pitch
    w.location.hash = "#/tool/leads";
    await tick();
    $('[name="offer"]').value = "Small-batch gin";
    $('[name="idealCustomer"]').value = "Bottle shops";
    $('[name="location"]').value = "Fitzroy VIC";
    script = [{ status: "done", result: { searchSummary: "Searched.", leads: [
      { name: "Cellar One", website: "https://cellar-one.example", location: "Fitzroy VIC", category: "bottle shop", whyFit: "Local producers.", publicContact: "hi@cellar-one.example", sourceUrl: "https://cellar-one.example" },
      { name: "Bar Two", website: "", location: "Fitzroy VIC", category: "bar", whyFit: "Gin list.", publicContact: "", sourceUrl: "https://directory.example/bar-two" },
    ] } }];
    $("#tool-root form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => $(".tool-output").innerHTML.includes("Cellar One"));
    check("leads render as cards", (app().match(/data-add="/g) || []).length === 2);
    check("lead contact email becomes a mailto link", app().includes('href="mailto:hi@cellar-one.example"'));
    $('[data-add="0"]').click();
    await tick();
    const saved = JSON.parse(w.localStorage.getItem("awspp-leads-shortlist") || "[]");
    check("adding a lead saves it in this browser", saved.length === 1 && saved[0].name === "Cellar One" && saved[0].status === "New");
    check("shortlist shows the saved lead", $("#leads-list").textContent.includes("Cellar One"));
    const sel = $('[data-status="0"]');
    sel.value = "Contacted";
    sel.dispatchEvent(new w.Event("change", { bubbles: true }));
    check("status change is saved", JSON.parse(w.localStorage.getItem("awspp-leads-shortlist"))[0].status === "Contacted");
    $('[data-pitch="0"]').click();
    await tick();
    $('[data-pitch-form="0"] [name="senderName"]').value = "Dana";
    script = [{ status: "done", result: { subject: "Gin for Cellar One", body: "Hi team,\n\nShort note.\n\nDana" } }];
    $('[data-pitch-form="0"]').dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => $("#leads-list").innerHTML.includes("Gin for Cellar One"));
    const pitchPost = posted[posted.length - 1];
    check("pitch job sends the lead and offer", pitchPost.tool === "pitch" && pitchPost.input.lead.name === "Cellar One" && pitchPost.input.offer === "Small-batch gin");
    check("pitch is shown and kept with the lead", $("#leads-list").innerHTML.includes("Gin for Cellar One") && JSON.parse(w.localStorage.getItem("awspp-leads-shortlist"))[0].pitch.subject === "Gin for Cellar One");
    script = [{ status: "done", result: { searchSummary: "", leads: [] } }];
    $("#tool-root form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => $(".tool-output").textContent.includes("No matching businesses"));
    const second = posted[posted.length - 1];
    check("next search excludes shortlisted leads", second.tool === "leads" && second.input.exclude.indexOf("Cellar One") >= 0);
    check("an empty search says so plainly", $(".tool-output").textContent.includes("broader location"));
    check("spam act note is shown", app().includes("Spam Act 2003"));

    // Offline (saved copy / no functions): example instead
    w.fetch = async () => { throw new Error("network"); };
    w.location.hash = "#/tool/shot-prompts";
    await tick();
    $('[name="product"]').value = "Honey";
    $("#tool-root form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => $(".tool-output").innerHTML.includes("Example output"));
    check("offline AI tool explains and shows the example", $(".tool-output").textContent.includes("live website") && $(".tool-output").innerHTML.includes("Example output"));
    w.close();
  }

  // ── 5. Tools in preview mode ──────────────────────────────────────────
  console.log("Tools (preview mode):");
  {
    const { w } = makeDom({ demo: true });
    bootApp(w);
    await tick(); await tick();
    w.location.hash = "#/tools";
    await tick();
    const app = () => w.document.querySelector("#app").innerHTML;
    check("tools open in preview mode", app().includes("tool-card") && app().includes('class="sidebar"'));
    w.close();
  }

  console.log(failures ? "\n" + failures + " FAILURES" : "\nAll smoke tests passed.");
  process.exit(failures ? 1 : 0);
})();
