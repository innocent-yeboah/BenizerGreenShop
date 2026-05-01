/**
 * Moolre Payments API — initiate collection.
 * @see https://docs.moolre.com/
 *
 * Set MOOLRE_COLLECT_URL to the full URL from your Moolre dashboard / OpenAPI docs
 * (path versions differ by account). Required headers: X-API-USER, X-API-KEY,
 * X-API-PUBKEY, X-API-VASKEY.
 */

export type MoolreInitiateInput = {
  amountGhs: number;
  email: string;
  reference: string;
  callbackUrl: string;
  redirectUrl: string;
  metadata?: Record<string, unknown>;
  description?: string;
};

function firstHttpUrl(...vals: unknown[]): string | null {
  for (const v of vals) {
    if (typeof v === "string" && /^https?:\/\//i.test(v.trim())) return v.trim();
  }
  return null;
}

function pickAuthUrl(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const inner = d.data;
  const candidates = [
    d.authorizationUrl,
    d.authorization_url,
    d.checkoutUrl,
    d.checkout_url,
    d.paymentUrl,
    d.payment_url,
    d.paymentLink,
    d.payment_link,
    d.url,
    d.link,
    d.go,
  ];
  const direct = firstHttpUrl(...candidates);
  if (direct) return direct;

  if (inner && typeof inner === "object") {
    const i = inner as Record<string, unknown>;
    const nested = [
      i.authorizationUrl,
      i.authorization_url,
      i.checkoutUrl,
      i.checkout_url,
      i.paymentUrl,
      i.payment_url,
      i.paymentLink,
      i.payment_link,
      i.url,
      i.link,
      i.go,
    ];
    const nestedUrl = firstHttpUrl(...nested);
    if (nestedUrl) return nestedUrl;
    const links = i.links;
    if (links && typeof links === "object") {
      const href = (links as Record<string, unknown>).href;
      const url = firstHttpUrl(href);
      if (url) return url;
    }
  }
  return null;
}

export function moolreConfigured(): boolean {
  const url = process.env.MOOLRE_COLLECT_URL;
  const privateKey = process.env.MOOLRE_PRIVATE_API_KEY?.trim();
  const publicKey = process.env.MOOLRE_PUBLIC_API_KEY?.trim();
  const user = process.env.MOOLRE_API_USER?.trim();
  const key = process.env.MOOLRE_API_KEY?.trim();
  const pub = process.env.MOOLRE_API_PUBKEY?.trim();
  const vas = process.env.MOOLRE_API_VASKEY?.trim();
  const legacyReady = Boolean(user && key && pub && vas);
  const twoKeyReady = Boolean(privateKey && publicKey);
  return Boolean(url && (twoKeyReady || legacyReady));
}

export async function initiateMoolrePayment(
  input: MoolreInitiateInput,
): Promise<{ authorizationUrl: string } | { error: string }> {
  const collectUrl = process.env.MOOLRE_COLLECT_URL;
  if (!collectUrl) {
    return { error: "MOOLRE_COLLECT_URL is not set." };
  }

  const privateKey = process.env.MOOLRE_PRIVATE_API_KEY?.trim();
  const publicKey = process.env.MOOLRE_PUBLIC_API_KEY?.trim();

  const user = process.env.MOOLRE_API_USER?.trim();
  const key = process.env.MOOLRE_API_KEY?.trim();
  const pub = process.env.MOOLRE_API_PUBKEY?.trim();
  const vas = process.env.MOOLRE_API_VASKEY?.trim();

  const usingTwoKeyAuth = Boolean(privateKey && publicKey);
  if (!usingTwoKeyAuth && !(user && key && pub && vas)) {
    return {
      error:
        "Moolre credentials missing. Set either MOOLRE_PRIVATE_API_KEY + MOOLRE_PUBLIC_API_KEY, or legacy MOOLRE_API_USER/MOOLRE_API_KEY/MOOLRE_API_PUBKEY/MOOLRE_API_VASKEY.",
    };
  }

  const amountUnit = process.env.MOOLRE_AMOUNT_UNIT?.trim().toLowerCase();
  /** Default: pesewas (amount × 100), same as Paystack. Set MOOLRE_AMOUNT_UNIT=ghs if your Moolre endpoint expects cedis. */
  const amountPayload =
    amountUnit === "ghs" || amountUnit === "cedis"
      ? Number(input.amountGhs.toFixed(2))
      : Math.round(input.amountGhs * 100);

  const body: Record<string, unknown> = {
    amount: amountPayload,
    email: input.email,
    currency: "GHS",
    reference: input.reference,
    tx_ref: input.reference,
    transactionRef: input.reference,
    callbackUrl: input.callbackUrl,
    callback_url: input.callbackUrl,
    webhookUrl: input.callbackUrl,
    webhook_url: input.callbackUrl,
    redirectUrl: input.redirectUrl,
    redirect_url: input.redirectUrl,
    returnUrl: input.redirectUrl,
    return_url: input.redirectUrl,
    metadata: input.metadata ?? {},
  };
  if (input.description) {
    body.description = input.description;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (usingTwoKeyAuth) {
    // Two-key mode used by some Moolre accounts.
    headers.Authorization = `Bearer ${privateKey}`;
    headers["X-API-KEY"] = privateKey!;
    headers["X-API-PUBKEY"] = publicKey!;
  } else {
    // Legacy four-header mode retained for compatibility.
    headers["X-API-USER"] = user!;
    headers["X-API-KEY"] = key!;
    headers["X-API-PUBKEY"] = pub!;
    headers["X-API-VASKEY"] = vas!;
  }

  const res = await fetch(collectUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text) as unknown;
  } catch {
    const looksLikeHtml = /^\s*<!doctype|^\s*<html/i.test(text);
    const endpointHint =
      res.status === 404 || looksLikeHtml
        ? " Check MOOLRE_COLLECT_URL; it likely points to a non-API route."
        : "";
    return { error: `Moolre returned non-JSON (${res.status}): ${text.slice(0, 200)}${endpointHint}` };
  }

  const envelope = typeof json === "object" && json !== null ? (json as Record<string, unknown>) : null;
  /** Moolre wraps payloads with status: 1 = success, 0 = failure (may still use HTTP 200). */
  if (envelope && "status" in envelope && envelope.status === 0) {
    const msg = [envelope.message, envelope.code].filter(Boolean).join(" — ") || "Request rejected";
    return { error: `Moolre: ${msg}` };
  }

  if (!res.ok) {
    const msg =
      typeof json === "object" && json && "message" in json
        ? String((json as { message: unknown }).message)
        : text.slice(0, 200);
    return { error: `Moolre error ${res.status}: ${msg}` };
  }

  const authUrl = pickAuthUrl(json);
  if (!authUrl) {
    return {
      error: `Moolre response missing checkout URL. Body: ${text.slice(0, 500)}`,
    };
  }

  return { authorizationUrl: authUrl };
}
