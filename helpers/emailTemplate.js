function getEmailTemplate(link) {
  return `
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <h2 style="color: #2c3e50;">Welcome to EcoNova Hotel Management System</h2>
      
      <p style="color: #333333; font-size: 16px;">
        You have been added as an <strong>admin user</strong> to the EcoNova Hotel Management System. Use the link below to verify your account.
        It is valid for only 24hrs:
      </p>
      
      <a href="${link}" style="display: inline-block; margin: 20px 0; padding: 12px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Your Account</a>
      
      <p style="color: #333333; font-size: 16px;">
        Your default password is: <strong>adminuser</strong>
      </p>

      <br>
      
      <p style="color: #333333; font-size: 16px;">
        Log in immediately after verification to change the default password.
      </p>
      
      <p style="color: #999999; font-size: 14px; margin-top: 30px;">
        If the button above doesn't work, copy and paste this link into your browser:<br>
        <span style="word-break: break-all;">${link}</span>
      </p>
    </div>
  </body>
`;
}

module.exports = getEmailTemplate;
