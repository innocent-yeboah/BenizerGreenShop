import { canSendWithCurrentResendSender, getResend, getResendFrom, isResendDebugEnabled } from "@/lib/resend";
import { siteConfig } from "@/lib/site-data";

const resendDebug = isResendDebugEnabled();

export function getTransactionalReplyTo(): string {
  const fromReply = process.env.RESEND_REPLY_TO?.trim();
  const fromAdmin = process.env.ADMIN_EMAIL?.trim();
  const site = siteConfig.email.trim();
  if (fromReply) return fromReply;
  if (fromAdmin) return fromAdmin;
  return site;
}

export function getTransactionalAdminEmail(): string {
  const fromEnv = process.env.ADMIN_EMAIL?.trim();
  return fromEnv?.length ? fromEnv : siteConfig.email.trim();
}

export async function sendTransactionalEmail(params: {
  to: string[];
  subject: string;
  html: string;
  text?: string;
  context: string;
}): Promise<void> {
  const resend = getResend();
  const resendFrom = getResendFrom();
  const replyTo = getTransactionalReplyTo();

  if (!resend) {
    if (resendDebug) {
      console.info(`[${params.context}] Resend disabled: RESEND_API_KEY is missing.`);
    }
    return;
  }

  const recipients = params.to.map((a) => a.trim().toLowerCase()).filter(Boolean);
  if (!recipients.length) {
    console.warn(`[${params.context}] Email skipped: no recipient addresses.`);
    return;
  }

  if (resendDebug) {
    console.info(`[${params.context}] Email attempt`, {
      from: resendFrom,
      replyTo,
      to: recipients,
      subject: params.subject,
    });
  }

  if (!canSendWithCurrentResendSender({ from: resendFrom, to: recipients })) {
    console.warn(
      `[${params.context}] Email skipped: sandbox sender ${resendFrom} cannot deliver to ${recipients.join(", ")}. ` +
        "Set RESEND_FROM to a verified domain or add RESEND_SANDBOX_ALLOWLIST for testing.",
    );
    return;
  }

  try {
    const result = await resend.emails.send({
      from: resendFrom,
      to: recipients,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo,
    });
    if (resendDebug) {
      console.info(`[${params.context}] Email accepted by Resend`, {
        id: result?.data?.id ?? null,
        error: result?.error?.message ?? null,
      });
    }
  } catch (e) {
    console.error(`[${params.context}] Resend send failed:`, e);
  }
}
