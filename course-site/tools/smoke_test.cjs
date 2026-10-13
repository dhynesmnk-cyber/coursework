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

    // Blog step 1: website is required, no request sent without it
    const step1 = () => $("#blog-step1");
    const step2 = () => $("#blog-step2");
    step1().querySelector("form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await tick();
    check("blog asks for a website before sending", step1().querySelector(".tool-output").textContent.includes("website address") && posted.length === 0);
    check("step 2 stays hidden until there's something to show", step2().classList.contains("hidden"));

    // Blog step 1: website -> business details + topics
    $('[name="url"]').value = "smithroofing.example";
    script = [{ status: "pending" }, { status: "running" }, { status: "done", result: {
      url: "https://smithroofing.example/",
      business: { name: "Smith Roofing", industry: "Roofing", location: "Ballarat VIC", services: ["Restorations", "Gutters"], audience: "Homeowners", summary: "Family-run roofers." },
      topics: [
        { title: "Winter Roof Checks", keyword: "roof maintenance ballarat", intent: "local", why: "Few local pages answer it." },
        { title: "Restore or Replace?", keyword: "roof restoration vs replacement", intent: "commercial", why: "Asked before a big spend." },
      ],
      method: "Searched local roofing questions.",
    } }];
    step1().querySelector("form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => !step2().classList.contains("hidden"));
    check("topics job sends the website", posted[0] && posted[0].tool === "blog-topics" && posted[0].input.url === "smithroofing.example" && /^[0-9a-f-]{36}$/.test(posted[0].jobId));
    check("step 2 is filled from the website", step2().querySelector('[name="business"]').value === "Smith Roofing" && step2().querySelector('[name="location"]').value === "Ballarat VIC" && step2().querySelector('[name="notes"]').value.includes("Services: Restorations, Gutters."));
    check("topic ideas are listed with their search phrase", (step2().innerHTML.match(/name="topicChoice"/g) || []).length === 3 && step2().textContent.includes('Targets "roof maintenance ballarat"'));
    check("no ranking is promised", step2().textContent.includes("not guarantees"));

    // Blog step 2: pick the second topic and write the post
    step2().querySelectorAll('[name="topicChoice"]')[1].checked = true;
    script = [{ status: "running" }, { status: "done", result: { title: "Restore or Replace?", metaDescription: "Meta here", post: "Intro.\n\n## Clear the gutters\n\nDo it in autumn." } }];
    step2().querySelector("form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => step2().querySelector(".tool-output").innerHTML.includes("Clear the gutters"));
    const blogPost = posted[posted.length - 1];
    check("post job sends the picked topic, its search phrase and the details", blogPost.tool === "blog-writer" && blogPost.input.topic === "Restore or Replace?" && blogPost.input.keyword === "roof restoration vs replacement" && blogPost.input.business === "Smith Roofing" && blogPost.input.website === "https://smithroofing.example/");
    const out2 = () => step2().querySelector(".tool-output");
    check("blog result renders the post as HTML", out2().innerHTML.includes("<h3>Clear the gutters</h3>") && out2().innerHTML.includes("Restore or Replace?"));
    check("blog result has copy and download", out2().innerHTML.includes('data-copy="#blog-md"') && $("#blog-download"));
    check("blog form remembers its inputs", (w.localStorage.getItem("awspp-blog-form") || "").includes("Smith Roofing"));

    // Own topic instead of a suggestion
    step2().querySelector('[name="customTopic"]').value = "Our new colourbond range";
    step2().querySelectorAll('[name="topicChoice"]')[2].checked = true;
    script = [{ status: "done", result: { title: "T", metaDescription: "M", post: "P" } }];
    step2().querySelector("form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => posted[posted.length - 1].input.topic === "Our new colourbond range");
    check("own topic is sent without a search phrase", posted[posted.length - 1].input.keyword === "");

    // Daily cap reached: friendly note plus the example
    script = [{ status: "error", code: "limit", error: "You've used your 5 free runs for today." }];
    step2().querySelector("form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => out2().innerHTML.includes("Example output"));
    check("cap reached shows the message and the example", out2().textContent.includes("5 free runs") && out2().innerHTML.includes("Example output"));

    // Other errors: message only
    script = [{ status: "error", code: "busy", error: "The AI service is busy right now." }];
    step2().querySelector("form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => out2().textContent.includes("busy"));
    check("service errors are shown plainly", out2().innerHTML.includes("notice-bad") && !out2().innerHTML.includes("Example output"));

    // Website can't be read: clear message, skip link still there
    script = [{ status: "error", code: "site_unreachable", error: "Couldn't reach that website. You can skip this step and fill in your details instead." }];
    step1().querySelector("form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => step1().querySelector(".tool-output").textContent.includes("Couldn't reach"));
    check("unreadable website explains and offers the manual route", step1().querySelector(".tool-output").textContent.includes("fill in your details") && $("#blog-skip"));

    // No website: skip straight to step 2
    w.location.hash = "#/tool/leads";
    await tick();
    w.location.hash = "#/tool/blog-writer";
    await tick();
    $("#blog-skip").click();
    await tick();
    check("skip shows step 2 with a topic box and no suggestions", !step2().classList.contains("hidden") && (step2().innerHTML.match(/name="topicChoice"/g) || []).length === 1 && step2().querySelector('[name="customTopic"]'));
    check("skip remembers the last business name", step2().querySelector('[name="business"]').value === "Smith Roofing");

    // Example buttons
    step1().querySelector(".show-example").click();
    await tick();
    check("topic example fills step 2 without a request", step1().querySelector(".tool-output").innerHTML.includes("Example output") && step2().querySelector('[name="business"]').value === "Smith Roofing (example)" && step2().textContent.includes("Roof Restoration or Replacement"));
    step2().querySelector(".show-example").click();
    await tick();
    check("post example works without a request", out2().innerHTML.includes("Example output") && out2().innerHTML.includes("Ballarat Winter"));

    // Custom-version box on every tool page and the gallery
    for (const t of w.COURSE_TOOLS.list()) {
      w.location.hash = "#/tool/" + t.slug;
      await tick();
      const box = $(".custom-cta");
      check(`custom-version box on ${t.slug}`, box && box.getAttribute("data-tool") === t.slug && box.textContent.includes("Dave builds custom tools"));
    }
    w.location.hash = "#/tools";
    await tick();
    check("custom-version box on the gallery", $(".custom-cta") && $(".custom-cta").textContent.includes("Need a tool these don't cover?"));
    w.location.hash = "#/tool/ai-cost";
    await tick();
    let formPosts = [];
    const fetchBefore = w.fetch;
    w.fetch = async (url, opts) => {
      if (String(url) === "/") { formPosts.push(String(opts.body)); return reply(200, {}); }
      return fetchBefore(url, opts);
    };
    check("custom-version form starts closed", $(".cta-form").classList.contains("hidden"));
    $(".cta-open").click();
    check("asking opens the form", !$(".cta-form").classList.contains("hidden"));
    $(".cta-form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await tick();
    check("custom-version form needs a name and email", $(".cta-status").textContent.includes("name and a working email") && formPosts.length === 0);
    $('.cta-form [name="name"]').value = "Sam Nguyen";
    $('.cta-form [name="email"]').value = "sam@example.com";
    $('.cta-form [name="message"]').value = "A cost check with our own rates";
    $(".cta-form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => $(".custom-cta").textContent.includes("Thanks, Sam"));
    const sent = new w.URLSearchParams(formPosts[0] || "");
    check("enquiry goes to the custom-build Netlify form with the tool name", sent.get("form-name") === "custom-build" && sent.get("tool") === "ai-cost" && sent.get("email") === "sam@example.com" && sent.get("message").includes("own rates"));
    check("enquiry thanks the visitor", $(".custom-cta").textContent.includes("Dave will be in touch"));
    check("index.html declares the custom-build form for Netlify", w.document.querySelector('form[name="custom-build"][netlify]') !== null);
    w.fetch = fetchBefore;

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

    // Website Check: fetched through site-check
    const siteHtml = '<html><head><title>Smith Roofing</title><script type="application/ld+json">{"@type":"WebSite","name":"Smith","url":"https://smith.example"}</script></head></html>';
    let siteReply = reply(200, { url: "https://smith.example/", status: 200, html: siteHtml, robots: { status: 200, text: "User-agent: GPTBot\nDisallow: /" } });
    const prevFetch = w.fetch;
    let siteUrl = "";
    w.fetch = async (url, opts) => (String(url).includes("site-check") ? (siteUrl = String(url), siteReply) : prevFetch(url, opts));
    w.location.hash = "#/tool/website-check";
    await tick();
    $('[name="url"]').value = "smith.example";
    $("#tool-root form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => $(".tool-output").innerHTML.includes("AI crawlers"));
    check("website check calls site-check with the URL", siteUrl.includes("site-check?url=smith.example"));
    check("website check scores structured data", $(".tool-output").textContent.includes("Structured data: 20/100"));
    check("website check shows GPTBot blocked, ClaudeBot allowed", /GPTBot<\/code><\/td>[\s\S]*?Blocked/.test($(".tool-output").innerHTML) && /ClaudeBot<\/code><\/td>[\s\S]*?Allowed/.test($(".tool-output").innerHTML));
    check("website check offers lines to append, not replace", $("#robots-out") && $("#robots-out").textContent.includes("User-agent: ClaudeBot") && !$("#robots-out").textContent.includes("GPTBot"));
    check("website check suggests JSON-LD", $("#schema-out") && $("#schema-out").textContent.includes('"@type": "LocalBusiness"'));
    siteReply = reply(502, { error: "That address points to a private network, so it can't be checked." });
    $("#tool-root form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => $(".tool-output").textContent.includes("private network"));
    check("website check errors open the paste option", $(".tool-output").textContent.includes("private network") && $(".paste-details").open === true);
    $('[name="html"]').value = siteHtml;
    $('[name="robots"]').value = "";
    $("#tool-root form").dispatchEvent(new w.Event("submit", { cancelable: true }));
    await waitFor(() => $(".tool-output").innerHTML.includes("AI crawlers"));
    check("pasted HTML works without the function", $(".tool-output").textContent.includes("No robots.txt was found"));
    w.fetch = prevFetch;

    // AI Cost Check: live maths
    w.location.hash = "#/tool/ai-cost";
    await tick();
    check("ai cost shows a verdict straight away", $(".tool-output").textContent.includes("Pays back the setup time in about 3 months"));
    $('[name="saved"]').value = "1";
    $("#tool-root form").dispatchEvent(new w.Event("input", { bubbles: true }));
    await tick();
    check("ai cost recalculates on input", $(".tool-output").textContent.includes("Doesn't pay for itself"));

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
