/* config.js — EDIT THIS FILE to brand the course and connect Stripe.
 * Everything a seller needs to change lives here and nowhere else.
 */
window.COURSE_CONFIG = {
  // ── Branding ──────────────────────────────────────────────────────────
  brand: {
    // Your business name, shown in the header and on the certificate.
    sellerName: "Your Business Name",           // EDIT ME
    courseTitle: "AI Without the Sales Pitch",
    courseTagline:
      "A self-paced, plain-language AI course for small and medium businesses. No hype. No jargon. Ten documents you can use on Monday.",
    supportEmail: "you@yourbusiness.com.au",    // EDIT ME (shown to learners)
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
    individualPrice: "A$XX",   // EDIT ME — display price on the landing page
    businessPrice: "A$XXX",    // EDIT ME — display price on the landing page
  },

  // ── Course mechanics ──────────────────────────────────────────────────
  quizPassMark: 0.8,        // 4 of 5 correct passes a class quiz
  qaPollSeconds: 45,        // how often an open Q&A inbox checks for replies
  netlifyFormName: "course-question", // must match the hidden form in index.html
};
