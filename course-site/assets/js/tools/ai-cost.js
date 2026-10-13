/* ai-cost.js — AI Cost Check (free, browser only). Replaces the old ROI
 * calculator with Class 5's cost reality check: what a subscription costs
 * against the time it would need to save. Every figure is shown with its
 * working, and the time-saved guess is labelled as the weak link.
 */
(function () {
  "use strict";
  const T = window.COURSE_TOOLS;
  const WEEKS_PER_MONTH = 52 / 12;

  const FIELDS = [
    { name: "staff", label: "People who would use it", value: 3, min: 1, max: 500, step: 1 },
    { name: "hours", label: "Hours a week each spends on the task now", value: 4, min: 0, max: 60, step: 0.5 },
    { name: "rate", label: "Cost of an hour of their time ($, including super and on-costs)", value: 45, min: 0, max: 1000, step: 1 },
    { name: "saved", label: "Share of that time AI would save (%)", value: 20, min: 0, max: 100, step: 1, hint: "Guess low. Class 2: measure it in a pilot before you believe it." },
    { name: "price", label: "Subscription per person per month ($)", value: 40, min: 0, max: 1000, step: 1, hint: "Business tiers, not personal plans. See Document 6." },
    { name: "setup", label: "One-off setup and learning time per person (hours)", value: 6, min: 0, max: 200, step: 1 },
  ];

  function num(v, f) {
    const n = parseFloat(v);
    return Number.isFinite(n) ? Math.min(f.max, Math.max(f.min, n)) : f.value;
  }

  // Pure maths, exported for tests.
  function calc(i) {
    const hoursPerMonth = i.staff * i.hours * WEEKS_PER_MONTH;
    const timeValue = hoursPerMonth * i.rate;
    const monthlySaving = timeValue * (i.saved / 100);
    const monthlyCost = i.staff * i.price;
    const net = monthlySaving - monthlyCost;
    const setupCost = i.staff * i.setup * i.rate;
    return {
      hoursSavedPerMonth: hoursPerMonth * (i.saved / 100),
      monthlySaving,
      monthlyCost,
      net,
      setupCost,
      firstYear: net * 12 - setupCost,
      paybackMonths: net > 0 ? setupCost / net : null,
      breakEvenPercent: timeValue > 0 ? (monthlyCost / timeValue) * 100 : null,
    };
  }

  const money = (n) => (n < 0 ? "-$" : "$") + Math.round(Math.abs(n)).toLocaleString("en-AU");

  function render() {
    const saved = T.local.get("awspp-aicost-form", {});
    return `
      <form class="stack-form tool-form" novalidate>
        <div class="field-row">
          ${FIELDS.map((f) => `
            <label class="field"><span class="field-label">${T.ui.esc(f.label)}</span>
              <input type="number" name="${f.name}" min="${f.min}" max="${f.max}" step="${f.step}" value="${saved[f.name] != null ? saved[f.name] : f.value}">
              ${f.hint ? '<span class="fine">' + T.ui.esc(f.hint) + "</span>" : ""}</label>`).join("")}
        </div>
      </form>
      ${T.freeFooter()}
      <div class="tool-output" aria-live="polite"></div>`;
  }

  function bind(root) {
    const form = root.querySelector("form");
    const out = root.querySelector(".tool-output");
    const update = () => {
      const raw = T.formValues(form);
      const i = {};
      FIELDS.forEach((f) => { i[f.name] = num(raw[f.name], f); });
      T.local.set("awspp-aicost-form", i);
      const r = calc(i);
      const verdict = r.net > 0
        ? (r.paybackMonths <= 1 ? "Pays for itself in the first month" : "Pays back the setup time in about " + Math.ceil(r.paybackMonths) + " months")
        : "Doesn't pay for itself at these numbers";
      out.innerHTML = `
        <div class="result-box">
          <h3 class="${r.net > 0 ? "ok-text" : "bad-text"}">${verdict}</h3>
          <div class="grid grid-3 stat-grid">
            <div class="card stat"><p class="stat-num">${money(r.monthlyCost)}</p><p>subscriptions a month</p></div>
            <div class="card stat"><p class="stat-num">${money(r.monthlySaving)}</p><p>time saved a month (${Math.round(r.hoursSavedPerMonth)} hours)</p></div>
            <div class="card stat"><p class="stat-num">${money(r.firstYear)}</p><p>first year, after setup time</p></div>
          </div>
          <ul class="working">
            <li>Net each month: ${money(r.monthlySaving)} saved minus ${money(r.monthlyCost)} in subscriptions = <strong>${money(r.net)}</strong>.</li>
            <li>One-off setup and learning: ${i.staff} people x ${i.setup} hours x ${money(i.rate)} = <strong>${money(r.setupCost)}</strong>.</li>
            ${r.breakEvenPercent != null ? "<li>To cover the subscriptions alone it has to save at least <strong>" + (Math.ceil(r.breakEvenPercent * 10) / 10) + "%</strong> of that task time. " + (r.breakEvenPercent > i.saved ? "That's more than your estimate." : "Your estimate clears that.") + "</li>" : ""}
          </ul>
          <p class="fine">Time saved is only worth money if it goes to something useful, and checking AI output takes time too. Treat the result as a reason to run a small pilot, not as a forecast.</p>
        </div>`;
    };
    form.addEventListener("input", update);
    form.addEventListener("submit", (e) => { e.preventDefault(); update(); });
    update();
  }

  T.lib = T.lib || {};
  T.lib.aiCost = { calc, FIELDS };

  T.register({
    slug: "ai-cost",
    title: "AI Cost Check",
    kind: "free",
    blurb: "Is a team AI subscription worth it? Compare the monthly cost with the time it would need to save, with the working shown.",
    related: [
      { slug: "class-5-software-without-the-software-bill", why: "the cost reality check from Class 5, with your own numbers." },
      { slug: "doc-06-tool-comparison-matrix", why: "take the per-seat prices from the matrix and test them here." },
      { slug: "class-2-selling-the-sizzle", why: "check a vendor's time-saving claim against what it would have to deliver." },
    ],
    render,
    bind,
  });
})();
