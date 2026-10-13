/* site-audit.js — pure logic for the Website Check tool: structured data
 * (JSON-LD) audit and robots.txt rules for AI crawlers. No DOM writes and
 * no network, so it is easy to test. Exposed as COURSE_TOOLS.lib.site.
 * Rewritten from the old bee-free-tools schemaAudit.ts with plainer,
 * checkable explanations (no promised rankings or click-through rates).
 */
(function () {
  "use strict";
  const T = window.COURSE_TOOLS;

  // Schema.org types that say "this is a business": the common ones for
  // Australian small business. Any of them satisfies the identity check.
  const BUSINESS_TYPES = [
    "Organization", "Corporation", "LocalBusiness", "ProfessionalService",
    "HomeAndConstructionBusiness", "Plumber", "Electrician", "RoofingContractor", "HVACBusiness",
    "GeneralContractor", "HousePainter", "Locksmith", "MovingCompany", "AutomotiveBusiness", "AutoRepair",
    "FoodEstablishment", "Restaurant", "CafeOrCoffeeShop", "Bakery", "BarOrPub", "Winery", "Brewery", "Distillery",
    "Store", "OnlineStore", "ClothingStore", "FlowerShop", "HardwareStore", "LiquorStore", "PetStore", "BookStore",
    "HealthAndBeautyBusiness", "BeautySalon", "HairSalon", "DaySpa", "NailSalon", "MedicalBusiness", "Dentist",
    "Physiotherapy", "Optician", "Pharmacy", "VeterinaryCare", "LegalService", "Attorney", "AccountingService",
    "FinancialService", "RealEstateAgent", "TravelAgency", "ChildCare", "EducationalOrganization",
    "ExerciseGym", "SportsActivityLocation", "LodgingBusiness", "Hotel", "Motel", "BedAndBreakfast",
    "EntertainmentBusiness", "EmploymentAgency", "InsuranceAgency",
  ];

  const KINDS = {
    local: { label: "Trade or local service", type: "LocalBusiness" },
    food: { label: "Cafe, restaurant or bar", type: "Restaurant" },
    shop: { label: "Shop (in person or online)", type: "Store" },
    health: { label: "Health, beauty or wellbeing", type: "HealthAndBeautyBusiness" },
    other: { label: "Other business or organisation", type: "Organization" },
  };

  const has = (o, k) => o && o[k] != null && !(Array.isArray(o[k]) && !o[k].length) && o[k] !== "";
  const typesOf = (o) => [].concat(o && o["@type"] ? o["@type"] : []).map(String);

  // All JSON-LD objects on the page, flattening arrays and @graph.
  function extractJsonLd(doc) {
    const items = [];
    const broken = [];
    Array.prototype.forEach.call(doc.querySelectorAll('script[type="application/ld+json"]'), (el, i) => {
      let parsed;
      try {
        parsed = JSON.parse(el.textContent || "");
      } catch (e) {
        broken.push({ index: i + 1, reason: "The JSON is not valid, so search engines will ignore this block." });
        return;
      }
      const walk = (node) => {
        if (Array.isArray(node)) return node.forEach(walk);
        if (!node || typeof node !== "object") return;
        if (node["@type"]) items.push(node);
        if (Array.isArray(node["@graph"])) node["@graph"].forEach(walk);
      };
      walk(parsed);
    });
    return { items, broken };
  }

  function pageInfo(doc, pageUrl) {
    const meta = (sel) => { const el = doc.querySelector(sel); return el ? (el.getAttribute("content") || "").trim() : ""; };
    const title = (doc.querySelector("title") ? doc.querySelector("title").textContent : "").trim();
    const canonical = doc.querySelector('link[rel="canonical"]');
    const tel = doc.querySelector('a[href^="tel:"]');
    return {
      name: meta('meta[property="og:site_name"]') || title.split(/\s[|\-–—:]\s/)[0].trim(),
      url: (canonical && canonical.getAttribute("href")) || meta('meta[property="og:url"]') || pageUrl || "",
      telephone: tel ? decodeURIComponent(tel.getAttribute("href").slice(4)).trim() : "",
      image: meta('meta[property="og:image"]'),
      description: meta('meta[name="description"]') || meta('meta[property="og:description"]'),
    };
  }

  // Score out of 100 with every point explained.
  function audit(doc, { kind, pageUrl } = {}) {
    const k = KINDS[kind] ? kind : "local";
    const { items, broken } = extractJsonLd(doc);
    const business = items.find((o) => typesOf(o).some((t) => BUSINESS_TYPES.indexOf(t) >= 0));
    const website = items.find((o) => typesOf(o).indexOf("WebSite") >= 0);
    const checks = [];
    const add = (points, max, label, ok, fix) => checks.push({ points: ok ? points : 0, max, label, ok, fix });

    add(40, 40, "Business details in structured data", !!business,
      "Add a " + KINDS[k].type + " block (suggested below) so search engines and AI assistants read your name, address and phone from a reliable source instead of guessing.");
    add(10, 10, "Business name and website address", !!business && has(business, "name") && has(business, "url"),
      "Include both name and url in your business block.");
    add(10, 10, "Street address", !!business && has(business, "address"),
      "Add your address (or service area) so you can be matched to local searches.");
    add(10, 10, "Phone number", !!business && has(business, "telephone"),
      "Add a telephone number in the same format you use everywhere else.");
    add(5, 5, "Opening hours", !!business && (has(business, "openingHours") || has(business, "openingHoursSpecification")),
      "Add openingHours, and keep it in step with your Google Business Profile.");
    add(5, 5, "Logo or photo", !!business && (has(business, "image") || has(business, "logo")),
      "Add an image or logo URL.");
    add(10, 10, "WebSite block", !!website, "Add a small WebSite block with your site name and address.");
    add(10, 10, "No broken structured data", broken.length === 0,
      "Fix or remove the broken block(s): invalid JSON is ignored completely.");

    const score = checks.reduce((n, c) => n + c.points, 0);
    return {
      score,
      checks,
      broken,
      found: items.map((o) => typesOf(o).join(", ")),
      info: pageInfo(doc, pageUrl),
      kind: k,
    };
  }

  // A starting point the visitor fills in. Bracketed values must be replaced.
  function suggestJsonLd(result) {
    const info = result.info;
    const type = KINDS[result.kind].type;
    const business = {
      "@context": "https://schema.org",
      "@type": type,
      name: info.name || "[Business name]",
      url: info.url || "[https://your-website.com.au/]",
      telephone: info.telephone || "[+61 X XXXX XXXX]",
      address: {
        "@type": "PostalAddress",
        streetAddress: "[Street address]",
        addressLocality: "[Suburb]",
        addressRegion: "[State, e.g. VIC]",
        postalCode: "[Postcode]",
        addressCountry: "AU",
      },
      openingHours: ["Mo-Fr 08:00-17:00"],
    };
    if (info.image) business.image = info.image;
    if (info.description) business.description = info.description;
    const site = { "@context": "https://schema.org", "@type": "WebSite", name: business.name, url: business.url };
    const block = (o) => '<script type="application/ld+json">\n' + JSON.stringify(o, null, 2) + "\n</script>";
    return block(business) + "\n" + block(site);
  }

  // ── robots.txt ────────────────────────────────────────────────────────
  // Crawlers that matter for AI, grouped by what blocking them does.
  const CRAWLERS = [
    { token: "GPTBot", who: "OpenAI", purpose: "training" },
    { token: "ClaudeBot", who: "Anthropic", purpose: "training" },
    { token: "Google-Extended", who: "Google (Gemini)", purpose: "training" },
    { token: "Applebot-Extended", who: "Apple", purpose: "training" },
    { token: "meta-externalagent", who: "Meta", purpose: "training" },
    { token: "CCBot", who: "Common Crawl (used by many AI labs)", purpose: "training" },
    { token: "OAI-SearchBot", who: "OpenAI (ChatGPT search)", purpose: "search" },
    { token: "Claude-SearchBot", who: "Anthropic (Claude search)", purpose: "search" },
    { token: "PerplexityBot", who: "Perplexity", purpose: "search" },
    { token: "Googlebot", who: "Google Search (incl. AI Overviews)", purpose: "search" },
    { token: "Bingbot", who: "Bing (incl. Copilot)", purpose: "search" },
  ];

  function parseRobots(text) {
    const groups = [];
    let current = null;
    let lastWasAgent = false;
    String(text || "").split(/\r?\n/).forEach((rawLine) => {
      const line = rawLine.replace(/#.*$/, "").trim();
      if (!line) return;
      const i = line.indexOf(":");
      if (i < 0) return;
      const field = line.slice(0, i).trim().toLowerCase();
      const value = line.slice(i + 1).trim();
      if (field === "user-agent") {
        if (!current || !lastWasAgent) { current = { agents: [], rules: [] }; groups.push(current); }
        current.agents.push(value.toLowerCase());
        lastWasAgent = true;
      } else if (field === "allow" || field === "disallow") {
        if (current) current.rules.push({ allow: field === "allow", path: value });
        lastWasAgent = false;
      } else {
        lastWasAgent = false;
      }
    });
    return groups;
  }

  function ruleMatches(pattern, path) {
    if (pattern === "") return false; // "Disallow:" with nothing blocks nothing
    const anchored = pattern.endsWith("$");
    const body = (anchored ? pattern.slice(0, -1) : pattern)
      .split("*").map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
    return new RegExp("^" + body + (anchored ? "$" : "")).test(path);
  }

  // RFC 9309: a crawler obeys the groups naming it, otherwise the "*" groups.
  // Among matching rules the longest wins; on a tie, Allow wins.
  function evaluate(groups, token, path) {
    const t = token.toLowerCase();
    let chosen = groups.filter((g) => g.agents.indexOf(t) >= 0);
    let via = token;
    if (!chosen.length) { chosen = groups.filter((g) => g.agents.indexOf("*") >= 0); via = "*"; }
    if (!chosen.length) return { allowed: true, via: null, rule: null };
    const rules = [].concat.apply([], chosen.map((g) => g.rules)).filter((r) => ruleMatches(r.path, path || "/"));
    if (!rules.length) return { allowed: true, via, rule: null };
    rules.sort((a, b) => (b.path.length - a.path.length) || (a.allow === b.allow ? 0 : a.allow ? -1 : 1));
    const r = rules[0];
    return { allowed: r.allow, via, rule: (r.allow ? "Allow: " : "Disallow: ") + r.path };
  }

  function crawlerReport(robotsText, found) {
    const groups = found ? parseRobots(robotsText) : [];
    return CRAWLERS.map((c) => Object.assign({}, c, evaluate(groups, c.token, "/")));
  }

  // Lines to append to opt out of AI training while staying in AI search.
  function trainingOptOut(report) {
    const allowedTrainers = report.filter((c) => c.purpose === "training" && c.allowed);
    if (!allowedTrainers.length) return "";
    return "# Opt out of AI model training (search crawlers are unaffected)\n" +
      allowedTrainers.map((c) => "User-agent: " + c.token + "\nDisallow: /").join("\n\n") + "\n";
  }

  T.lib = T.lib || {};
  T.lib.site = { KINDS, CRAWLERS, BUSINESS_TYPES, extractJsonLd, audit, suggestJsonLd, parseRobots, evaluate, crawlerReport, trainingOptOut };
})();
