const companyInviteTemplate = ({ companyName, inviterName, acceptUrl }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>You're Invited</title>
</head>
<body style="margin:0;padding:40px 20px;background:#f4f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">

  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 8px 24px rgba(0,0,0,0.06);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:40px 30px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🚀</div>
      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">
        You're Invited!
      </h1>
    </div>

    <!-- Content -->
    <div style="padding:40px 32px;">

      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;">
        Hello,
      </p>

      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;">
        <strong>${inviterName}</strong> has invited you to join
        <strong>${companyName}</strong> on
        <strong>Task Management</strong>.
      </p>

      <p style="margin:0 0 30px;font-size:16px;line-height:1.7;color:#4b5563;">
        Collaborate with your team, manage projects, assign tasks, and stay
        organized in one place.
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin:40px 0;">
        <a
          href="${acceptUrl}"
          style="
            display:inline-block;
            background:#4f46e5;
            color:#ffffff;
            text-decoration:none;
            padding:14px 34px;
            border-radius:8px;
            font-size:16px;
            font-weight:600;
          "
        >
          Accept Invitation
        </a>
      </div>

      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:18px;margin-top:20px;">
        <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6;">
          If the button above doesn't work, copy and paste this link into your browser:
        </p>

        <p style="margin:12px 0 0;word-break:break-all;">
          <a
            href="${acceptUrl}"
            style="color:#4f46e5;text-decoration:none;"
          >
            ${acceptUrl}
          </a>
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="padding:24px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">

      <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">
        ⏳ This invitation will expire in <strong>7 days</strong>.
      </p>

      <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
        If you weren't expecting this invitation, you can safely ignore this email.
      </p>

      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />

      <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
        © ${new Date().getFullYear()} Task Management. All rights reserved.
      </p>

    </div>

  </div>

</body>
</html>
`;

module.exports = companyInviteTemplate;
