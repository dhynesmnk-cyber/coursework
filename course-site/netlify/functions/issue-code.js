// issue-code.js — called from the Stripe success URL with ?session_id=...
// Verifies the checkout session with Stripe, works out which licence was
// bought, and issues a single-use access code. Idempotent per session.
import Stripe from "stripe";
import { store, json, fail, makeCode } from "./utils/helpers.js";

export const handler = async (event) => {
  try {
    const sessionId =
      (event.queryStringParameters && event.queryStringParameters.session_id) || "";
    if (!sessionId) return fail("missing session_id");

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return fail("server not configured (STRIPE_SECRET_KEY)", 500);
    const stripe = new Stripe(secret);

    const s = store(event);

    // Idempotency: one code per paid session, ever.
    const existing = await s.get(`sessions/${sessionId}`, { type: "json" });
    if (existing && existing.code) return json(existing);

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });
    if (!session) return fail("session not found", 404);
    if (session.payment_status !== "paid") return fail("payment not complete", 402);

    // Determine tier from the purchased price/product id.
    const ids = (session.line_items && session.line_items.data ? session.line_items.data : [])
      .map((li) => {
        const p = li.price || {};
        return [p.id, typeof p.product === "string" ? p.product : (p.product && p.product.id)].filter(Boolean);
      })
      .flat();

    const individual = (process.env.STRIPE_PRICE_INDIVIDUAL || "").split(",").filter(Boolean);
    const business = (process.env.STRIPE_PRICE_BUSINESS || "").split(",").filter(Boolean);

    let tier = null;
    if (ids.some((id) => business.includes(id))) tier = "business";
    else if (ids.some((id) => individual.includes(id))) tier = "individual";
    else {
      // Fallback: infer from amount so a misconfigured env does not strand a paying customer.
      const amount = session.amount_total || 0;
      tier = amount >= parseInt(process.env.STRIPE_BUSINESS_MIN_AMOUNT || "10000", 10) ? "business" : "individual";
    }

    const code = makeCode();
    const record = {
      code,
      tier,
      sessionId,
      email: session.customer_details && session.customer_details.email ? session.customer_details.email : "",
      createdAt: Date.now(),
      redeemed: false,
    };

    await s.setJSON(`codes/${code}`, record);
    await s.setJSON(`sessions/${sessionId}`, { code, tier });

    return json({ code, tier });
  } catch (err) {
    return fail("issue failed: " + err.message, 500);
  }
};
