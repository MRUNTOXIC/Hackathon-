import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOtpEmail(to: string, code: string, name: string) {
  const mailOptions = {
    from: `"Comet Code 🌠" <${process.env.GMAIL_USER}>`,
    to,
    replyTo: 'noreply@cometcode.dev',
    subject: `${code} — Your HackDash verification code`,
    text: `Hi ${name},\n\nYour one-time login code is: ${code}\n\nThis code expires in 10 minutes. Do not share it with anyone.\n\n— Comet Code`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your OTP Code</title>
</head>
<body style="margin:0;padding:0;background-color:#0f1117;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f1117;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#1a1f2e,#12151f);border-radius:16px;border:1px solid #2a2f40;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;text-align:center;border-bottom:1px solid #2a2f40;">
              <!-- Comet icon -->
              <div style="display:inline-block;background:linear-gradient(135deg,#06b6d4,#3b82f6);border-radius:12px;padding:12px;margin-bottom:16px;">
                <span style="font-size:28px;line-height:1;">&#127794;</span>
              </div>
              <div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Comet Code</div>
              <div style="font-size:12px;color:#64748b;margin-top:4px;letter-spacing:1.5px;text-transform:uppercase;">HackDash · Verification</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <p style="margin:0 0 8px;font-size:15px;color:#94a3b8;">Hey <strong style="color:#e2e8f0;">${name}</strong>,</p>
              <p style="margin:0 0 28px;font-size:15px;color:#94a3b8;line-height:1.6;">
                Someone (hopefully you!) is trying to sign in to HackDash. Use the code below to verify your identity.
              </p>

              <!-- OTP box -->
              <div style="background:linear-gradient(135deg,#0c1929,#0f2040);border:1px solid #1e3a5f;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
                <div style="font-size:11px;color:#64748b;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">One-Time Code</div>
                <div style="font-size:48px;font-weight:800;letter-spacing:12px;color:#06b6d4;font-family:'Courier New',monospace;text-shadow:0 0 20px rgba(6,182,212,0.4);">${code}</div>
                <div style="margin-top:14px;font-size:12px;color:#475569;">
                  &#9679;&nbsp; Expires in <strong style="color:#f59e0b;">10 minutes</strong>
                </div>
              </div>

              <p style="margin:0 0 8px;font-size:13px;color:#475569;line-height:1.7;">
                If you didn&rsquo;t request this, you can safely ignore this email &mdash; your account remains secure.
              </p>
              <p style="margin:0;font-size:13px;color:#475569;">
                Never share this code with anyone, including event staff.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #1e2535;text-align:center;">
              <p style="margin:0;font-size:11px;color:#334155;letter-spacing:0.3px;">
                This is an automated message from <strong style="color:#475569;">Comet Code / HackDash</strong>.<br/>
                Please do not reply to this email &mdash; replies go to <span style="color:#475569;">noreply@cometcode.dev</span>.
              </p>
              <div style="margin-top:14px;">
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#1e3a5f;margin:0 3px;"></span>
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#06b6d4;margin:0 3px;"></span>
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#1e3a5f;margin:0 3px;"></span>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };

  await transporter.sendMail(mailOptions);
}
