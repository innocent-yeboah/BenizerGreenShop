/**
 * Moolre Payments API — initiate collection.
 * @see https://docs.moolre.com/
 *
 * Set MOOLRE_COLLECT_URL to the full URL from your Moolre dashboard / OpenAPI docs
 * (path versions differ by account). Required headers: X-API-USER, X-API-KEY,
 * X-API-PUBKEY, X-API-VASKEY.
 *
 * Hosted checkout: `MOOLRE_COLLECT_URL=https://api.moolre.com/embed/link` and
 * `MOOLRE_ACCOUNT_NUMBER` (merchant wallet from the Moolre dashboard).
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

/** If `MOOLRE_PUBLIC_API_KEY` is a JWT, Moolre often expects `userid` as `X-API-USER`. */
function userIdFromMoolrePublicJwt(publicKey: string | undefined): string | null {
  if (!publicKey || !publicKey.includes(".")) return null;
  const parts = publicKey.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    ) as { userid?: number; userId?: number };
    const id = payload.userid ?? payload.userId;
    if (typeof id === "number" && Number.isFinite(id)) return String(id);
    return null;
  } catch {
    return null;
  }
}

function resolveMoolreApiUser(): string | null {
  const explicit = process.env.MOOLRE_API_USER?.trim();
  const jwtSource = process.env.MOOLRE_PUBLIC_API_KEY?.trim();
  const fromJwt = userIdFromMoolrePublicJwt(jwtSource);
  if (process.env.MOOLRE_FORCE_JWT_USERID?.trim().toLowerCase() === "true" && fromJwt) {
    return fromJwt;
  }
  if (explicit && explicit.includes("@") && fromJwt) {
    return fromJwt;
  }
  if (explicit) return explicit;
  return fromJwt;
}

/** Header `X-API-PUBKEY`: dashboard sometimes exposes this separately from the JWT "public API key". */
function resolveMoolrePubkeyForHeader(): string | null {
  const apiPub = process.env.MOOLRE_API_PUBKEY?.trim();
  const bundled = process.env.MOOLRE_PUBLIC_API_KEY?.trim();
  return apiPub || bundled || null;
}

export function moolreConfigured(): boolean {
  const url = process.env.MOOLRE_COLLECT_URL?.trim();
  if (!url) return false;
  const privateKey = process.env.MOOLRE_PRIVATE_API_KEY?.trim();
  const publicKey = process.env.MOOLRE_PUBLIC_API_KEY?.trim();
  const user = process.env.MOOLRE_API_USER?.trim();
  const key = process.env.MOOLRE_API_KEY?.trim();
  const pub = process.env.MOOLRE_API_PUBKEY?.trim();
  const vas = process.env.MOOLRE_API_VASKEY?.trim();
  const accountNumber = process.env.MOOLRE_ACCOUNT_NUMBER?.trim();
  const legacyReady = Boolean(user && key && pub && vas);
  const twoKeyReady = Boolean(privateKey && publicKey);
  const headerPub = resolveMoolrePubkeyForHeader();
  const userPubReady = Boolean(resolveMoolreApiUser() && headerPub);

  if (/\/embed\/link(?:\?|$)/i.test(url)) {
    return Boolean(userPubReady && accountNumber);
  }
  if (/\/open\/transact\/payment(?:\?|$)/i.test(url)) {
    return userPubReady;
  }
  return Boolean(twoKeyReady || legacyReady);
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
  const pubkeyForHeader = resolveMoolrePubkeyForHeader();
  const apiUser = resolveMoolreApiUser();
  const accountNumber = process.env.MOOLRE_ACCOUNT_NUMBER?.trim();

  const user = process.env.MOOLRE_API_USER?.trim();
  const key = process.env.MOOLRE_API_KEY?.trim();
  const pub = process.env.MOOLRE_API_PUBKEY?.trim();
  const vas = process.env.MOOLRE_API_VASKEY?.trim();

  const isEmbedLink = /\/embed\/link(?:\?|$)/i.test(collectUrl);
  const isOpenTransactPayment = /\/open\/transact\/payment(?:\?|$)/i.test(collectUrl);
  const usingTwoKeyAuth = Boolean(privateKey && publicKey);
  if (isEmbedLink) {
    if (!(apiUser && pubkeyForHeader && accountNumber)) {
      return {
        error:
          "Moolre embed/link: set MOOLRE_ACCOUNT_NUMBER (wallet in dashboard), MOOLRE_PUBLIC_API_KEY or MOOLRE_API_PUBKEY, and MOOLRE_API_USER (or omit it to derive userid from a JWT in MOOLRE_PUBLIC_API_KEY). MOOLRE_COLLECT_URL should be https://api.moolre.com/embed/link",
      };
    }
  } else if (isOpenTransactPayment) {
    if (!(apiUser && pubkeyForHeader)) {
      return {
        error:
          "Moolre auth missing for /open/transact/payment. Set MOOLRE_PUBLIC_API_KEY or MOOLRE_API_PUBKEY, and MOOLRE_API_USER (or omit MOOLRE_API_USER if your public key is a JWT so userid can be inferred).",
      };
    }
  } else if (!usingTwoKeyAuth && !(user && key && pub && vas)) {
    return {
      error:
        "Moolre credentials missing. Set either MOOLRE_PRIVATE_API_KEY + MOOLRE_PUBLIC_API_KEY, or legacy MOOLRE_API_USER/MOOLRE_API_KEY/MOOLRE_API_PUBKEY/MOOLRE_API_VASKEY.",
    };
  }

  const amountUnit = process.env.MOOLRE_AMOUNT_UNIT?.trim().toLowerCase();
  /** Hosted Open API + embed/link expect major units (GH₵). Custom collect URLs may use pesewas (×100) like Paystack. */
  const majorUnitsDefault = isEmbedLink || isOpenTransactPayment;
  let amountPayload: number;
  if (amountUnit === "ghs" || amountUnit === "cedis") {
    amountPayload = Number(input.amountGhs.toFixed(2));
  } else if (amountUnit === "pesewas" || amountUnit === "minor") {
    amountPayload = Math.round(input.amountGhs * 100);
  } else if (majorUnitsDefault) {
    amountPayload = Number(input.amountGhs.toFixed(2));
  } else {
    amountPayload = Math.round(input.amountGhs * 100);
  }

  const body: Record<string, unknown> = isEmbedLink
    ? {
        // Hosted payment page — matches industry integrations (embed/link + wallet account).
        type: 1,
        amount: amountPayload,
        accountNumber,
        email: input.email,
        externalref: input.reference,
        callback: input.callbackUrl,
        redirect: input.redirectUrl,
        reusable: "0",
        currency: "GHS",
        accountnumber: accountNumber,
        metadata: input.metadata ?? {},
      }
    : isOpenTransactPayment
      ? {
          // Docs: Generate Payment Link — only type, amount, callback (same URL as other payment ops).
          type: 1,
          amount: String(amountPayload),
          callback: input.callbackUrl,
        }
      : {
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
  if (isEmbedLink || isOpenTransactPayment) {
    headers["X-API-USER"] = apiUser!;
    headers["X-API-PUBKEY"] = pubkeyForHeader!;
    // Open docs list only USER + PUBKEY; sending private key here often yields AIN01.
    if (
      privateKey &&
      isOpenTransactPayment &&
      process.env.MOOLRE_OPEN_INCLUDE_PRIVATE_HEADER?.trim().toLowerCase() === "true"
    ) {
      headers["X-API-KEY"] = privateKey;
    }
  } else if (usingTwoKeyAuth) {
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
    const code = envelope.code != null ? String(envelope.code) : "";
    const authHint =
      code === "AIN01"
        ? " Confirm MOOLRE_API_USER equals your Moolre API username (often numeric userid from the JWT). Use MOOLRE_API_PUBKEY if the dashboard shows a separate public key from the JWT. Regenerate keys if the JWT may be expired. For checkout, prefer MOOLRE_COLLECT_URL=https://api.moolre.com/embed/link with MOOLRE_ACCOUNT_NUMBER."
        : "";
    return { error: `Moolre: ${msg}${authHint}` };
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
