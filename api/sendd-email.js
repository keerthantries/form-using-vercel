await transporter.sendMail({
  from: process.env.SMTP_USER,
  to: email,
  subject: `We’ve Received Your Message!`,
  html: `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f5f5;padding:0;margin:0;">
    <tr>
      <td align="center">
        <table role="presentation" width="650" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border-radius:12px;overflow:hidden;font-family:Poppins,Arial,sans-serif;font-size:16px;line-height:1.6;color:#333;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#0bb9db;color:#fff;padding:30px;">
              <img src="https://i.ibb.co/tpP9hVh1/logo-removebg-preview.png" alt="VSaaS Logo" style="height:50px;margin-bottom:10px;display:block;">
              <h4 style="margin:0;font-weight:400;font-size:1.1em;">Thank You for Reaching Out</h4>
              <h1 style="margin:0.3em 0 0;font-weight:600;font-size:1.8em;">We’ve <span style="color:#ffeb3b;">Received</span> Your Message!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px;">
              <p>Hi ${name},</p>
              <p>Thank you for contacting <strong>VSaaS Technologies</strong>.<br>
              We’ve successfully received your inquiry and our team is reviewing your request.<br>
              One of our representatives will get back to you within <strong>2 business days</strong>.</p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:25px 0;padding:15px;background:#f9fbfc;border-left:4px solid #1976d2;border-radius:6px;">
                <tr>
                  <td>
                    <h3 style="margin-top:0;color:#1976d2;">Why Choose VSaaS Technologies?</h3>
                    <ul style="padding-left:20px;margin:0;">
                      <li>✔ Cutting-edge Development solutions</li>
                      <li>✔ Proven reliability and scalability</li>
                      <li>✔ All-round IT and business services</li>
                      <li>✔ Dedicated support and fast response</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="text-align:center;">
                <a href="https://vsaastechnologies.com" target="_blank"
                   style="background:#1976d2;color:#fff;text-decoration:none;
                          padding:12px 24px;border-radius:24px;font-weight:bold;display:inline-block;">
                  Visit Our Website
                </a>
              </p>

              <hr style="margin:2em 0;border:none;height:2px;background:#1976d2;">
              <p>Best regards,</p>
              <p style="font-size:0.8em;color:#1976d2;margin:0;">VSAAS Technologies private limited./p>
              <p>info@vsaastechnologies.com <br>+91 7893024466</p>
              <p><em>Customer Support</em><br>VSaaS Technologies</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f1f3f6;padding:1em;font-size:0.9em;color:#777;">
              &copy; 2025 VSaaS Technologies. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  `
});
