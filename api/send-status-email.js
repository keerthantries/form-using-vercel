// api/send-status-email.js
// Deploy this file to your existing Vercel project alongside sendd-email.js
// Uses the same SMTP credentials already configured in your Vercel environment variables.

const nodemailer = require("nodemailer");

// ─────────────────────────────────────────
// EMAIL TEMPLATES
// ─────────────────────────────────────────

function getInterestedEmail({ name, course, price, curriculumLink, qrCodeUrl }) {
  return {
    subject: `Vidhyapat Course Enrollment Details – Complete Your Registration`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#1d4ed8;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">🎓 Vidhyapat Learning</h1>
        </div>
        <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
          <p style="font-size:16px">Dear <strong>${name}</strong>,</p>
          <p style="font-size:15px;line-height:1.6">
            Thank you for showing interest in <strong>${course}</strong> at Vidhyapat!
            We're excited to have you on board. Below are your course enrollment details:
          </p>

          <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px">
            <tr style="background:#eff6ff">
              <td style="padding:10px 14px;border:1px solid #dbeafe;font-weight:600;width:40%">Course</td>
              <td style="padding:10px 14px;border:1px solid #dbeafe">${course}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">Course Fee</td>
              <td style="padding:10px 14px;border:1px solid #e5e7eb">${price || "Contact us for pricing"}</td>
            </tr>
            ${curriculumLink ? `
            <tr style="background:#eff6ff">
              <td style="padding:10px 14px;border:1px solid #dbeafe;font-weight:600">Curriculum</td>
              <td style="padding:10px 14px;border:1px solid #dbeafe">
                <a href="${curriculumLink}" style="color:#1d4ed8">View Curriculum →</a>
              </td>
            </tr>` : ""}
          </table>

          <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:20px;margin:20px 0">
            <h3 style="margin:0 0 12px;color:#c2410c;font-size:15px">💳 Payment Instructions</h3>
            <p style="margin:0 0 8px;font-size:14px;line-height:1.5">
              To confirm your seat, please complete the payment using the QR code below:
            </p>
            ${qrCodeUrl
              ? `<div style="text-align:center;margin:16px 0">
                   <img src="${qrCodeUrl}" alt="Payment QR Code"
                        style="max-width:180px;border:2px solid #e5e7eb;border-radius:8px;padding:8px;background:#fff">
                   <p style="font-size:12px;color:#6b7280;margin-top:8px">Scan to pay</p>
                 </div>`
              : `<p style="font-size:14px;color:#6b7280">QR code will be shared separately. Please contact support.</p>`
            }
            <p style="font-size:13px;color:#374151;margin-top:8px">
              After payment, please reply to this email with your <strong>transaction screenshot</strong> for verification.
            </p>
          </div>

          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-top:16px">
            <h4 style="margin:0 0 6px;color:#15803d;font-size:14px">📞 Support</h4>
            <p style="margin:0;font-size:13px;color:#374151">
              Questions? Email us at <a href="mailto:support@vidhyapat.com" style="color:#1d4ed8">support@vidhyapat.com</a>
              or visit <a href="https://vidhyapat.com" style="color:#1d4ed8">vidhyapat.com</a>
            </p>
          </div>

          <p style="margin-top:28px;font-size:14px;color:#6b7280">
            Warm regards,<br>
            <strong style="color:#1a1a1a">Team Vidhyapat</strong>
          </p>
        </div>
      </div>
    `
  };
}

function getEnrolledEmail({ name, course, lmsUrl, username, tempPassword, startDate }) {
  return {
    subject: `Your Vidhyapat LMS Login Details – Welcome to ${course}!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#059669;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">🎉 Vidhyapat Learning</h1>
        </div>
        <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
          <p style="font-size:16px">Dear <strong>${name}</strong>,</p>
          <p style="font-size:15px;line-height:1.6">
            🎊 <strong>Congratulations!</strong> Your enrollment for <strong>${course}</strong> is confirmed.
            You can now access the Vidhyapat Learning Portal using the details below.
          </p>

          <div style="background:#ecfdf5;border:2px solid #6ee7b7;border-radius:10px;padding:24px;margin:20px 0">
            <h3 style="margin:0 0 16px;color:#065f46;font-size:15px">🔐 Your Login Credentials</h3>
            <table style="width:100%;font-size:14px;border-collapse:collapse">
              <tr>
                <td style="padding:8px 0;font-weight:600;color:#374151;width:40%">LMS Portal</td>
                <td style="padding:8px 0">
                  <a href="${lmsUrl || 'https://lms.vidhyapat.com'}" style="color:#1d4ed8;font-weight:600">
                    ${lmsUrl || 'https://lms.vidhyapat.com'} →
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:600;color:#374151">Username</td>
                <td style="padding:8px 0;font-family:monospace;background:#f3f4f6;padding:6px 10px;border-radius:4px">
                  ${username}
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:600;color:#374151">Password</td>
                <td style="padding:8px 0;font-family:monospace;background:#f3f4f6;padding:6px 10px;border-radius:4px">
                  ${tempPassword || 'Vidhyapat@123'}
                </td>
              </tr>
              ${startDate ? `
              <tr>
                <td style="padding:8px 0;font-weight:600;color:#374151">Course Start</td>
                <td style="padding:8px 0">${startDate}</td>
              </tr>` : ""}
            </table>
          </div>

          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px;margin:16px 0">
            <p style="margin:0;font-size:13px;color:#92400e">
              ⚠️ <strong>Important:</strong> Please change your password after your first login for security.
            </p>
          </div>

          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin-top:16px">
            <h4 style="margin:0 0 6px;color:#1e40af;font-size:14px">📞 Need Help?</h4>
            <p style="margin:0;font-size:13px;color:#374151">
              Contact us at <a href="mailto:support@vidhyapat.com" style="color:#1d4ed8">support@vidhyapat.com</a>
            </p>
          </div>

          <p style="margin-top:28px;font-size:14px">
            Welcome to Vidhyapat! We're thrilled to be part of your learning journey. 🚀<br><br>
            Warm regards,<br>
            <strong>Team Vidhyapat</strong>
          </p>
        </div>
      </div>
    `
  };
}

function getNotInterestedEmail({ name }) {
  return {
    subject: `Thank You for Your Interest in Vidhyapat`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#4b5563;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">🎓 Vidhyapat Learning</h1>
        </div>
        <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
          <p style="font-size:16px">Dear <strong>${name}</strong>,</p>
          <p style="font-size:15px;line-height:1.7;color:#374151">
            Thank you for showing interest in Vidhyapat. We completely understand that the timing
            may not be right for you at the moment.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#374151">
            Whenever you're ready to explore courses in:
          </p>
          <ul style="font-size:14px;line-height:2;color:#374151;padding-left:20px">
            <li>🤖 AI / Machine Learning</li>
            <li>🔐 Cyber Security</li>
            <li>📊 Data Science</li>
            <li>💻 Full Stack Development</li>
            <li>📱 Android &amp; iOS Development</li>
          </ul>
          <p style="font-size:15px;line-height:1.7;color:#374151">
            — we'll always be here to help you grow.
          </p>

          <div style="text-align:center;margin:28px 0">
            <a href="https://vidhyapat.com"
               style="background:#1d4ed8;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600">
              Explore Our Programs →
            </a>
          </div>

          <p style="font-size:14px;color:#6b7280">
            We look forward to supporting your learning journey someday.<br><br>
            Warm regards,<br>
            <strong style="color:#1a1a1a">Team Vidhyapat</strong>
          </p>
        </div>
      </div>
    `
  };
}

// ─────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────
module.exports = async (req, res) => {
  // Allow CORS from your dashboard domain
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const {
    status,       // "Interested" | "Enrolled" | "Not Interested"
    studentEmail,
    studentName,
    course,
    // Interested extras
    price,
    curriculumLink,
    qrCodeUrl,
    // Enrolled extras
    lmsUrl,
    username,
    tempPassword,
    startDate
  } = req.body;

  if (!status || !studentEmail || !studentName) {
    return res.status(400).json({ error: "Missing required fields: status, studentEmail, studentName" });
  }

  // Build email based on status
  let emailContent;
  if (status === "Interested") {
    emailContent = getInterestedEmail({ name: studentName, course, price, curriculumLink, qrCodeUrl });
  } else if (status === "Enrolled") {
    emailContent = getEnrolledEmail({
      name: studentName, course,
      lmsUrl, username: username || studentEmail,
      tempPassword, startDate
    });
  } else if (status === "Not Interested") {
    emailContent = getNotInterestedEmail({ name: studentName });
  } else {
    // No email needed for this status
    return res.status(200).json({ ok: true, skipped: true, reason: "No email template for this status" });
  }

  // Reuse the same SMTP credentials from your Vercel environment variables
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,   // same env var as your contact form
      pass: process.env.EMAIL_PASS    // same app password
    }
  });

  try {
    await transporter.sendMail({
      from: `"Vidhyapat Learning" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: emailContent.subject,
      html: emailContent.html
    });

    return res.status(200).json({ ok: true, message: `Email sent to ${studentEmail} for status: ${status}` });
  } catch (err) {
    console.error("[send-status-email] SMTP error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
