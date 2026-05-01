import { canSendWithCurrentResendSender, getResend, getResendFrom, isResendDebugEnabled } from "@/lib/resend";
import { siteConfig } from "@/lib/site-data";

const resendDebug = isResendDebugEnabled();

export function getTransactionalReplyTo(): string {
  return (process.env.RESEND_REPLY_TO || process.env.ADMIN_EMAIL || siteConfig.email).trim();
}

export function getTransactionalAdminEmail(): string {
  return process.env.ADMIN_EMAIL || siteConfig.email;
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

  if (resendDebug) {
    console.info(`[${params.context}] Email attempt`, {
      from: resendFrom,
      replyTo,
      to: params.to,
      subject: params.subject,
    });
  }

  if (!canSendWithCurrentResendSender({ from: resendFrom, to: params.to })) {
    console.warn(
      `[${params.context}] Email skipped: sandbox sender ${resendFrom} cannot deliver to ${params.to.join(", ")}. ` +
        "Set RESEND_FROM to a verified domain or add RESEND_SANDBOX_ALLOWLIST for testing.",
    );
    return;
  }

  try {
    const result = await resend.emails.send({
      from: resendFrom,
      to: params.to,
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
