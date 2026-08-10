import { Resend } from "resend";
import { logger } from "./logger.js";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function getResend(): Resend {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return resend;
}

export async function sendDownloadEmail({
  to,
  guideName,
  downloadUrl,
}: {
  to: string;
  guideName: string;
  downloadUrl: string;
}): Promise<void> {
  if (!resend) {
    logger.warn("RESEND_API_KEY not set — skipping email delivery");
    return;
  }

  const { error } = await resend.emails.send({
    from: "AiVass Guides <guides@aivass.com>",
    to,
    subject: `Your guide is ready — ${guideName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#FDFBF6;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFBF6;padding:48px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="padding:0 0 32px 0;">
          <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#12233F;letter-spacing:0.04em;">
            AiVass<span style="color:#7E3033;">✦</span>
          </p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#12233F;padding:48px 40px;border-radius:2px;">
          <p style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:28px;color:#F7F3E9;line-height:1.3;">
            Your guide is ready.
          </p>
          <p style="margin:16px 0 0 0;font-size:15px;color:#D9A39B;line-height:1.7;">
            ${guideName}
          </p>
          <hr style="border:none;border-top:1px solid rgba(247,243,233,0.15);margin:32px 0;" />
          <p style="margin:0 0 24px 0;font-size:14px;color:#F7F3E9;line-height:1.8;opacity:0.85;">
            Thank you for your purchase. Your download link is ready below.
            You have <strong>3 download attempts</strong> and the link expires in <strong>72 hours</strong>.
          </p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="background:#7E3033;border-radius:2px;">
              <a href="${downloadUrl}"
                style="display:inline-block;padding:14px 32px;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#F7F3E9;text-decoration:none;font-weight:600;">
                Download Your Guide →
              </a>
            </td></tr>
          </table>
          <p style="margin:24px 0 0 0;font-size:11px;color:rgba(247,243,233,0.4);line-height:1.7;">
            If the button does not work, paste this link into your browser:<br />
            <span style="color:rgba(247,243,233,0.6);">${downloadUrl}</span>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:32px 0 0 0;">
          <p style="margin:0;font-size:11px;color:#999;line-height:1.7;">
            AiVass · connect@aivass.com<br />
            These guides are educational materials, not legal advice or representation.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `.trim(),
  });

  if (error) {
    logger.error({ error }, "Failed to send download email");
    throw new Error(`Email delivery failed: ${error.message}`);
  }

  logger.info({ to, guideName }, "Download email sent");
}
