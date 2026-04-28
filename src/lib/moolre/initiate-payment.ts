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

function pickAuthUrl(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const inner = d.data;
  const candidates = [
    d.authorizationUrl,
    d.authorization_url,
    d.checkoutUrl,
    d.checkout_url,
    d.url,
    d.link,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.startsWith("http")) return c;
  }
  if (inner && typeof inner === "object") {
    const i = inner as Record<string, unknown>;
    const nested = [
      i.authorizationUrl,
      i.authorization_url,
      i.checkoutUrl,
      i.checkout_url,
      i.url,
      i.link,
    ];
    for (const c of nested) {
      if (typeof c === "string" && c.startsWith("http")) return c;
    }
  }
  return null;
}

export function moolreConfigured(): boolean {
  const user = process.env.MOOLRE_API_USER;
  const key = process.env.MOOLRE_API_KEY;
  const pub = process.env.MOOLRE_API_PUBKEY;
  const vas = process.env.MOOLRE_API_VASKEY;
  const url = process.env.MOOLRE_COLLECT_URL;
  return Boolean(user && key && pub && vas && url);
}

export async function initiateMoolrePayment(
  input: MoolreInitiateInput,
): Promise<{ authorizationUrl: string } | { error: string }> {
  const collectUrl = process.env.MOOLRE_COLLECT_URL;
  if (!collectUrl) {
    return { error: "MOOLRE_COLLECT_URL is not set." };
  }

  const user = process.env.MOOLRE_API_USER!;
  const key = process.env.MOOLRE_API_KEY!;
  const pub = process.env.MOOLRE_API_PUBKEY!;
  const vas = process.env.MOOLRE_API_VASKEY!;

  /** Amount: pesewas (smallest GHS unit), same convention as Paystack. */
  const amountPesewas = Math.round(input.amountGhs * 100);

  const body: Record<string, unknown> = {
    amount: amountPesewas,
    email: input.email,
    currency: "GHS",
    reference: input.reference,
    callbackUrl: input.callbackUrl,
    redirectUrl: input.redirectUrl,
    metadata: input.metadata ?? {},
  };
  if (input.description) {
    body.description = input.description;
  }

  const res = await fetch(collectUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-USER": user,
      "X-API-KEY": key,
      "X-API-PUBKEY": pub,
      "X-API-VASKEY": vas,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text) as unknown;
  } catch {
    return { error: `Moolre returned non-JSON (${res.status}): ${text.slice(0, 200)}` };
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
