const companyInviteTemplate = ({ companyName, inviterName, acceptUrl }) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
    <h2>You've been invited to join ${companyName}</h2>
    <p>${inviterName} has invited you to join their team on Task Management.</p>
    <p>
      <a href="${acceptUrl}" style="display:inline-block;padding:10px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;">
        Accept Invitation
      </a>
    </p>
    <p style="color:#666;font-size:12px;">This invitation expires in 7 days. If you didn't expect this, you can ignore this email.</p>
  </div>
`;

module.exports = companyInviteTemplate;
