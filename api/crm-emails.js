
import nodemailer from 'nodemailer';

// ─────────────────────────────────────────
// BRAND CONFIG
// ─────────────────────────────────────────
const BRAND = {
  name:    'Vidhyapat',
  tagline: 'Empowering Careers Through Technology',
  website: 'https://vidhyapat.com',
  email:   'support@vidhyapat.com',
  phone:   '+91 7893026644',
  logo:    'https://res.cloudinary.com/doqbjnliq/image/upload/v1768821884/logo_oe6pjv.png',
  bank: {
    name:  'Vidhyapat Technologies Pvt Ltd',
    acNo:  '81795315194',
    ifsc:  'IDFB0080218'
  },
  colors: {
    primary:     '#1976d2',
    primaryDark: '#1565c0',
    success:     '#2e7d32',
    warning:     '#e65100',
    danger:      '#c62828',
    purple:      '#7c3aed',
    orange:      '#f97316',
    gray:        '#4b5563',
    lightBg:     '#f0f7ff',
    border:      '#dbeafe',
    text:        '#1a1a2e',
    muted:       '#6b7280'
  }
};

// ─────────────────────────────────────────
// BASE HTML WRAPPER
// ─────────────────────────────────────────
const wrap = (content, accentColor = BRAND.colors.primary) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%); margin: 0; padding: 0; }
  .email-outer { width: 100%; padding: 40px 16px; }
  .email-card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(25,118,210,0.12); }
  .email-header { background: ${accentColor}; padding: 32px 40px 28px; text-align: center; }
  .email-header img { height: 52px; display: block; margin: 0 auto 16px; filter: brightness(0) invert(1); }
  .email-header h1 { color: #fff; font-size: 22px; font-weight: 700; letter-spacing: 0.3px; margin: 0; }
  .email-header p { color: rgba(255,255,255,0.82); font-size: 13px; margin-top: 5px; }
  .email-body { padding: 36px 40px; color: ${BRAND.colors.text}; font-size: 15px; line-height: 1.75; }
  .greeting { font-size: 16px; margin-bottom: 14px; }
  .info-table { width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px; border-radius: 8px; overflow: hidden; }
  .info-table tr:nth-child(odd) td { background: ${BRAND.colors.lightBg}; }
  .info-table td { padding: 11px 16px; border: 1px solid ${BRAND.colors.border}; color: ${BRAND.colors.text}; vertical-align: middle; }
  .info-table td:first-child { font-weight: 600; width: 38%; color: ${accentColor}; }
  .highlight-box { border-radius: 10px; padding: 22px 24px; margin: 22px 0; }
  .highlight-box h3 { font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .credential-box { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 22px 24px; margin: 22px 0; }
  .credential-box h3 { color: ${BRAND.colors.success}; font-size: 15px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .cred-row { display: flex; align-items: center; gap: 12px; padding: 9px 0; border-bottom: 1px solid #d1fae5; font-size: 14px; }
  .cred-row:last-child { border-bottom: none; }
  .cred-label { font-weight: 600; color: ${BRAND.colors.gray}; min-width: 140px; }
  .cred-value { font-family: 'Courier New', monospace; background: #ecfdf5; padding: 4px 10px; border-radius: 6px; font-size: 13px; color: #065f46; border: 1px solid #a7f3d0; }
  .cred-link { color: ${BRAND.colors.primary}; font-weight: 600; text-decoration: none; font-size: 14px; }
  .alert-box { border-radius: 8px; padding: 13px 16px; margin: 14px 0; font-size: 13px; display: flex; align-items: flex-start; gap: 10px; line-height: 1.6; }
  .alert-box i { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
  .cta-btn { display: inline-block; padding: 13px 32px; border-radius: 30px; text-decoration: none; font-size: 15px; font-weight: 600; color: #ffffff; background: ${accentColor}; box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
  .qr-wrap { text-align: center; margin: 18px 0; }
  .qr-wrap img { max-width: 170px; border: 2px solid #e5e7eb; border-radius: 12px; padding: 10px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
  .qr-label { font-size: 12px; color: ${BRAND.colors.muted}; margin-top: 8px; }
  .course-pill { display: flex; align-items: center; gap: 10px; padding: 11px 16px; margin: 8px 0; background: ${BRAND.colors.lightBg}; border-left: 3px solid ${accentColor}; border-radius: 0 8px 8px 0; font-size: 14px; color: ${BRAND.colors.text}; }
  .course-pill i { color: ${accentColor}; font-size: 15px; }
  .divider { height: 1px; background: #e5e7eb; margin: 28px 0; }
  .signature { font-size: 14px; color: ${BRAND.colors.text}; }
  .signature strong { display: block; font-size: 15px; color: ${accentColor}; margin-top: 6px; }
  .signature .org { font-size: 13px; color: ${BRAND.colors.muted}; }
  .email-footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 22px 40px; text-align: center; font-size: 12px; color: ${BRAND.colors.muted}; }
  .email-footer a { color: ${accentColor}; text-decoration: none; }
  .footer-links { margin-top: 10px; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
  .footer-links a { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; }
</style>
</head>
<body>
<div class="email-outer">
  <div class="email-card">
    <div class="email-header">
      <img src="${BRAND.logo}" alt="${BRAND.name}"/>
      <h1>${BRAND.name} Learning</h1>
      <p>${BRAND.tagline}</p>
    </div>
    <div class="email-body">${content}</div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} ${BRAND.name} Technologies Private Limited. All rights reserved.</p>
      <div class="footer-links">
        <a href="${BRAND.website}"><i class="bi bi-globe"></i> vidhyapat.com</a>
        <a href="mailto:${BRAND.email}"><i class="bi bi-envelope"></i> ${BRAND.email}</a>
        <a href="tel:${BRAND.phone.replace(/\s/g,'')}"><i class="bi bi-telephone"></i> ${BRAND.phone}</a>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
const getSignature = () => `
  <div class="divider"></div>
  <div class="signature">
    Regards,<br/>
    <strong>Team ${BRAND.name}</strong>
    <div class="org" style="margin-top:6px;">
      ${BRAND.website}<br/>
      ${BRAND.email}<br/>
      ${BRAND.phone}
    </div>
  </div>
`;
// ─────────────────────────────────────────
// 1. NEW LEAD
// ─────────────────────────────────────────
function newLeadEmail({ name, course }) {
  return {
    subject: `Thank You for Reaching Out – ${BRAND.name}`,
    html: wrap(`
      <p class="greeting">Hi <strong>${name}</strong>,</p>

      <p>Thank you for reaching out to <strong>${BRAND.name}</strong>.</p>

      <p style="margin-top:14px;">
        We’re pleased to confirm that we’ve successfully received your inquiry.
        Our team is currently reviewing your request, and one of our representatives
        will get back to you within <strong>2 business days</strong> to assist you further.
      </p>

      <div class="highlight-box" style="background:#f0f7ff;border:1.5px solid #bfdbfe;">
        <h3 style="color:${BRAND.colors.primary};">
          <i class="bi bi-stars"></i>
          Why Choose ${BRAND.name} ?
        </h3>

        <div style="font-size:14px;color:${BRAND.colors.gray};line-height:2;">
          <div>• Cutting-edge development and technology solutions</div>
          <div>• Proven reliability and scalable systems</div>
          <div>• Comprehensive IT and business services</div>
          <div>• Dedicated support with quick response times</div>
        </div>
      </div>

      <p style="font-size:14px;color:${BRAND.colors.gray};">
        In the meantime, feel free to explore our services and learn more about how we can support your business goals by visiting our website.
      </p>

      <div style="text-align:center;margin:28px 0;">
        <a href="${BRAND.website}" class="cta-btn">
          Visit Our Website
        </a>
      </div>

      <p style="font-size:14px;color:${BRAND.colors.gray};">
        If you have any additional information to share regarding your inquiry,
        simply reply to this email and our team will be happy to assist you.
      </p>

      ${getSignature()}
    `, BRAND.colors.primary)
  };
}

// ─────────────────────────────────────────
// 2. INTERESTED
// ─────────────────────────────────────────
// ─────────────────────────────────────────
// 2. INTERESTED (Modified to use Dynamic Bank Settings)
// ─────────────────────────────────────────
function interestedEmail({ name, course, price, qrCodeUrl, bankName, bankAcNo, bankIfsc }) {
  return {
    subject: `${BRAND.name} – Course Enrollment Details for ${course}`,
    html: wrap(`
      <p class="greeting">Dear <strong>${name}</strong>,</p>

      <p>Thank you for showing interest in <strong>${course}</strong> at <strong>${BRAND.name}</strong>.</p>

      <p style="margin-top:12px;">Please find the course details below:</p>

      <table class="info-table">
        <tr>
          <td>Course Name</td>
          <td><strong>${course}</strong></td>
        </tr>
        <tr>
          <td>Course Duration</td>
          <td>As per batch schedule</td>
        </tr>
        <tr>
          <td>Course Fee</td>
          <td><strong>${price || 'Contact us for pricing'}</strong></td>
        </tr>
      </table>

      <p style="margin-top:14px;">
        To confirm your enrollment, kindly complete the payment using the QR code provided below.
      </p>

      <p><strong>Payment QR Code:</strong></p>

     ${qrCodeUrl
  ? `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 18px 0;">
       <tr>
         <td align="center">
           <div style="border: 2px solid #e5e7eb; border-radius: 12px; padding: 10px; display: inline-block; background: #ffffff;">
             <img src="${qrCodeUrl}" alt="Payment QR Code" width="180" style="display: block; border: 0;" />
           </div>
         </td>
       </tr>
     </table>`
  : `<p style="color:${BRAND.colors.muted};text-align:center;">QR code will be shared shortly.</p>`
}

      <div class="highlight-box" style="background:#f9fafb;border:1px solid #e5e7eb;">
        <p><strong>Bank Details :</strong></p>
        <p style="line-height:1.8;">
          A/C Name : ${bankName}<br/>
          A/C No : ${bankAcNo}<br/>
          IFSC Code : ${bankIfsc}
        </p>
      </div>

      <p style="margin-top:14px;"><strong>Payment Instructions:</strong></p>
      <p>
        After completing the payment, please reply to this email with the transaction screenshot or payment confirmation.
      </p>

      <p style="margin-top:14px;">
        If you have any questions or need assistance, please feel free to contact us.
      </p>

      <p>
        <strong>Support Contact:</strong><br/>
        ${BRAND.email}<br/>
        ${BRAND.phone}
      </p>

      <p style="margin-top:14px;">
        We look forward to welcoming you to ${BRAND.name} and supporting your learning journey.
      </p>

      ${getSignature()}
    `, BRAND.colors.warning)
  };
}

// ─────────────────────────────────────────
// 3. PAYMENT PENDING
// ─────────────────────────────────────────
// ─────────────────────────────────────────
// 3. PAYMENT PENDING (Modified to use Dynamic Bank Settings)
// ─────────────────────────────────────────
function paymentPendingEmail({ name, course, price, qrCodeUrl, bankName, bankAcNo, bankIfsc }) {
  return {
    subject: `${BRAND.name} – Your Payment for ${course} is Pending`,
    html: wrap(`
      <p class="greeting">Dear <strong>${name}</strong>,</p>
      <p>We noticed that your payment for the <strong>${course}</strong> course is still pending. Your seat is currently reserved — please complete the payment to confirm your spot.</p>

      <table class="info-table">
        <tr>
          <td><i class="bi bi-mortarboard" style="margin-right:6px"></i>Course</td>
          <td><strong>${course}</strong></td>
        </tr>
        <tr>
          <td><i class="bi bi-currency-rupee" style="margin-right:6px"></i>Amount</td>
          <td><strong>${price || 'Contact us for details'}</strong></td>
        </tr>
        <tr>
          <td><i class="bi bi-credit-card" style="margin-right:6px"></i>Payment Details</td>
          <td>QR code or bank transfer</td>
        </tr>
      </table>

      <div class="highlight-box" style="background:#fff7ed;border:1.5px solid #fed7aa;">
        <h3 style="color:${BRAND.colors.orange};">
          <i class="bi bi-qr-code-scan" style="color:${BRAND.colors.orange}"></i>
          Payment QR Code
        </h3>
        ${qrCodeUrl
  ? `<table width="100%" border="0" cellspacing="0" cellpadding="0">
       <tr>
         <td align="center">
           <div style="border: 2px solid #e5e7eb; border-radius: 12px; padding: 10px; display: inline-block; background: #ffffff;">
             <img src="${qrCodeUrl}" alt="Payment QR Code" width="180" style="display: block; border: 0;" />
           </div>
           <p class="qr-label" style="margin-top: 8px;">Scan to pay instantly</p>
         </td>
       </tr>
     </table>`
  : `<p style="text-align:center;color:${BRAND.colors.muted};">QR not available</p>`
}

        <div style="font-size:13px;color:${BRAND.colors.text};line-height:2.2;margin-top:16px;padding:14px;background:#f9fafb;border-radius:8px;">
          <div><strong>A/C Name :</strong> ${bankName}</div>
          <div><strong>A/C No :</strong> ${bankAcNo}</div>
          <div><strong>IFSC Code :</strong> ${bankIfsc}</div>
        </div>
      </div>

      <div class="alert-box" style="background:#f0fdf4;border:1px solid #bbf7d0;">
        <i class="bi bi-check-circle-fill" style="color:${BRAND.colors.success}"></i>
        <span style="color:#065f46;">Once the payment is completed, please reply with your <strong>transaction screenshot</strong>, and we will activate your account within <strong>24 hours</strong>.</span>
      </div>

      <div class="alert-box" style="background:#f0f7ff;border:1px solid #bfdbfe;">
        <i class="bi bi-headset" style="color:${BRAND.colors.primary}"></i>
        <span style="color:${BRAND.colors.gray};">
          For any questions, feel free to contact us at <a href="mailto:${BRAND.email}" style="color:${BRAND.colors.primary};font-weight:600;">${BRAND.email}</a>
        </span>
      </div>

      ${getSignature()}
    `, BRAND.colors.orange)
  };
}

// ─────────────────────────────────────────
// 4. ENROLLED (After Enrollment)
// ─────────────────────────────────────────
function enrolledEmail({ name, course, lmsUrl, username, tempPassword, startDate }) {
  return {
    subject: `Congratulations! Your Enrollment for ${course} is Confirmed – ${BRAND.name}`,
    html: wrap(`
      <p class="greeting">Dear <strong>${name}</strong>,</p>
      <p style="font-size:18px;font-weight:700;color:${BRAND.colors.success};margin:10px 0;">Congratulations! 🎉</p>
      <p>Your enrollment for <strong>${course}</strong> has been successfully confirmed. You can now access the <strong>${BRAND.name} Learning Management System (LMS)</strong> using the details below.</p>

      <div class="credential-box">
        <h3>
          <i class="bi bi-shield-lock-fill"></i>
          Your LMS Login Details
        </h3>
        <div class="cred-row">
          <span class="cred-label"><i class="bi bi-link-45deg" style="margin-right:4px"></i>LMS Login URL</span>
          <a href="${lmsUrl || 'https://lms.vidhyapat.com'}" class="cred-link">
            ${lmsUrl || 'https://lms.vidhyapat.com'} <i class="bi bi-box-arrow-up-right" style="font-size:11px;margin-left:3px"></i>
          </a>
        </div>
        <div class="cred-row">
          <span class="cred-label"><i class="bi bi-person" style="margin-right:4px"></i>Username</span>
          <span class="cred-value">${username}</span>
        </div>
        <div class="cred-row">
          <span class="cred-label"><i class="bi bi-key" style="margin-right:4px"></i>Temporary Password</span>
          <span class="cred-value">${tempPassword || 'Vidhyapat@123'}</span>
        </div>
        ${startDate ? `
        <div class="cred-row">
          <span class="cred-label"><i class="bi bi-calendar-event" style="margin-right:4px"></i>Course Start Date</span>
          <span style="font-size:14px;color:${BRAND.colors.text};">${startDate}</span>
        </div>` : ''}
      </div>

      <div class="alert-box" style="background:#fffbeb;border:1px solid #fde68a;">
        <i class="bi bi-exclamation-triangle-fill" style="color:#92400e;"></i>
        <span style="color:#92400e;">For security purposes, please <strong>change your password</strong> after your first login.</span>
      </div>

      <div style="text-align:center;margin:28px 0;">
        <a href="${lmsUrl || 'https://lms.vidhyapat.com'}" class="cta-btn" style="background:${BRAND.colors.success};">
          <i class="bi bi-play-circle" style="margin-right:6px"></i>Access ${BRAND.name} LMS
        </a>
      </div>

      <div class="alert-box" style="background:#f0f7ff;border:1px solid #bfdbfe;">
        <i class="bi bi-headset" style="color:${BRAND.colors.primary}"></i>
        <span style="color:${BRAND.colors.gray};">
          If you need any assistance, feel free to reach out to us at <a href="mailto:${BRAND.email}" style="color:${BRAND.colors.primary};font-weight:600;">${BRAND.email}</a> or <strong>${BRAND.phone}</strong>
        </span>
      </div>

      <p style="font-size:14px;color:${BRAND.colors.gray};margin-top:16px;">We are excited to have you with us and wish you a great learning experience with <strong>${BRAND.name}</strong>.</p>

      ${getSignature()}
    `, BRAND.colors.success)
  };
}

// ─────────────────────────────────────────
// 5. NOT INTERESTED
// ─────────────────────────────────────────
function notInterestedEmail({ name }) {
  return {
    subject: `Thank You for Your Interest in ${BRAND.name}`,
    html: wrap(`
      <p class="greeting">Dear <strong>${name}</strong>,</p>
      <p>Thank you for your interest in <strong>${BRAND.name}</strong>.</p>
      <p style="margin-top:14px;font-size:14px;color:${BRAND.colors.gray};">
        We understand that you may not be enrolling at this time. If you plan to pursue learning in the future, we would be happy to assist you.
      </p>

      <div style="margin:20px 0;">
        <div class="course-pill"><i class="bi bi-robot"></i> AI / Machine Learning</div>
        <div class="course-pill"><i class="bi bi-shield-check"></i> Cyber Security</div>
        <div class="course-pill"><i class="bi bi-bar-chart-line"></i> Data Science</div>
        <div class="course-pill"><i class="bi bi-code-slash"></i> Full Stack Development</div>
      </div>

      <p style="font-size:14px;color:${BRAND.colors.gray};">You can explore our programs anytime at:</p>

      <div style="text-align:center;margin:24px 0;">
        <a href="${BRAND.website}" class="cta-btn" style="background:${BRAND.colors.gray};">
          <i class="bi bi-grid" style="margin-right:6px"></i>${BRAND.website}
        </a>
      </div>

      <p style="font-size:14px;color:${BRAND.colors.gray};text-align:center;">We look forward to supporting your learning journey.</p>

     ${getSignature()}
    `, BRAND.colors.gray)
  };
}

// ─────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────
// ─────────────────────────────────────────
// MAIN HANDLER (Modified for Dynamic Bank Settings)
// ─────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  const {
    status, studentEmail, studentName, course,
    price, qrCodeUrl, curriculumLink,
    lmsUrl, username, tempPassword, startDate,
    // Add bank details here to extract them from the request
    bankName, bankAcNo, bankIfsc 
  } = req.body || {};

  if (!status || !studentEmail || !studentName) {
    return res.status(400).json({ error: 'Missing required fields: status, studentEmail, studentName' });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(500).json({ error: 'Email configuration error on server' });
  }

  const ACTIVE_STATUSES = ['New Lead', 'Contact', 'Interested', 'Payment Pending', 'Enrolled', 'Not Interested'];
  if (!ACTIVE_STATUSES.includes(status)) {
    console.log(`[${BRAND.name}] Skipped email for status: ${status}`);
    return res.status(200).json({ ok: true, skipped: true, reason: `No email configured for status: ${status}` });
  }

  let emailContent;
  switch (status) {
    case 'New Lead':
    case 'Contact':
      emailContent = newLeadEmail({ name: studentName, course });
      break;

    case 'Interested':
      // Pass the dynamic bank details here
      emailContent = interestedEmail({ 
        name: studentName, course, price, qrCodeUrl, curriculumLink,
        bankName: bankName || BRAND.bank.name, 
        bankAcNo: bankAcNo || BRAND.bank.acNo, 
        bankIfsc: bankIfsc || BRAND.bank.ifsc 
      });
      break;

    case 'Payment Pending':
      // Pass the dynamic bank details here
      emailContent = paymentPendingEmail({ 
        name: studentName, course, price, qrCodeUrl,
        bankName: bankName || BRAND.bank.name, 
        bankAcNo: bankAcNo || BRAND.bank.acNo, 
        bankIfsc: bankIfsc || BRAND.bank.ifsc 
      });
      break;

    case 'Enrolled':
      emailContent = enrolledEmail({
        name: studentName, course, lmsUrl,
        username: username || studentEmail,
        tempPassword, startDate
      });
      break;

    case 'Not Interested':
      emailContent = notInterestedEmail({ name: studentName });
      break;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from:    `"${BRAND.name} Learning" <${process.env.SMTP_USER}>`,
      to:      studentEmail,
      subject: emailContent.subject,
      html:    emailContent.html
    });

    console.log(`[${BRAND.name}] Email sent → ${status} → ${studentEmail}`);
    return res.status(200).json({ ok: true, message: `Email sent for status: ${status}` });

  } catch (err) {
    console.error(`[${BRAND.name}] SMTP error:`, err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
