/* config.js — EDIT THIS FILE to brand the course and connect Stripe.
 * Everything a seller needs to change lives here and nowhere else.
 */
window.COURSE_CONFIG = {
  // ── PREVIEW SWITCH ────────────────────────────────────────────────────
  // true  = open preview: no sign-in, no Stripe, progress saved in the
  //         browser only, question sending off. Anyone can browse the
  //         whole course.
  // false = live mode: Netlify Identity sign-in and Stripe checkout on.
  // Flip this one flag and redeploy to switch between the two.
  demoMode: true,

  // ── Branding ──────────────────────────────────────────────────────────
  brand: {
    // Your business name, shown in the header and on the certificate.
    sellerName: "C&P Consulting",               // EDIT ME
    courseTitle: "AI Without the Sales Pitch",
    courseTagline:
      "A self-paced, plain-language AI course for small and medium businesses. No hype. No jargon. Ten documents you can use on Monday.",
    supportEmail: "d.hynes.mnk@gmail.com",      // EDIT ME (shown to learners)
    // Who to contact, shown in the footer, the sidebar and on tool pages.
    contactName: "David Hynes",
    linkedin: "https://www.linkedin.com/in/david-hynes-b22608249",
    // Logo: leave null for the text wordmark, or set a path like "assets/img/logo.svg".
    logo: null,                                  // EDIT ME (optional)
  },

  // Colours are CSS variables set on :root in styles.css.
  // Change them here, or override in styles.css (any valid CSS colour).
  colors: {
    primary: "#0e3b49",     // EDIT ME — deep petrol, headers and navigation
    accent: "#dd9a35",      // EDIT ME — warm amber, calls to action
  },

  // ── Payments (Stripe Payment Links) ───────────────────────────────────
  // Create two Payment Links in your Stripe dashboard (see DEPLOY.md).
  // Set each link's "success URL" to:  https://YOUR-SITE/?session_id={CHECKOUT_SESSION_ID}
  // Then paste the two Payment Link URLs here.
  stripe: {
    individualLink: "",   // EDIT ME — e.g. https://buy.stripe.com/xxxx  (Individual licence)
    businessLink: "",     // EDIT ME — e.g. https://buy.stripe.com/yyyy  (Whole-business licence)
    individualPrice: "A$50",    // EDIT ME — display price on the landing page
    businessPrice: "A$250",     // EDIT ME — display price on the landing page
    // Display copy around the prices. The landing page reads these, so you
    // can reword or blank them without touching app.js.
    individualNote: "one-time, per person",            // EDIT ME
    businessNote: "one-time, for your whole team",     // EDIT ME
    businessExtra: "Includes one custom-built version of any tool in the Tools section, tailored to your business.",  // EDIT ME, or set to "" to hide
  },

  // ── Custom builds ─────────────────────────────────────────────────────
  // The small "want a version built for your business?" box at the bottom
  // of every tool page. Enquiries arrive through Netlify Forms (form name
  // "custom-build"), emailed to you once Forms notifications are on.
  customBuild: {
    name: "Dave",   // EDIT ME: who builds the custom versions
    email: "d.hynes.mnk@gmail.com", // shown under the form and if it can't be sent
  },

  // ── Course mechanics ──────────────────────────────────────────────────
  quizPassMark: 0.8,        // 4 of 5 correct passes a class quiz
  qaPollSeconds: 45,        // how often an open Q&A inbox checks for replies
  netlifyFormName: "course-question", // must match the hidden form in index.html
};
