import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // 1. CORS Configuration (Mandatory for frontend/serverless communication)
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Destructure and Validate Input
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    
    // 2.5. CAPTCHA Verification
    const token = req.body.token;
    if (!token) {
        return res.status(400).json({ error: 'Missing CAPTCHA token' });
    }

    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`
    });

    const verification = await verifyResponse.json();
    if (!verification.success) {
        return res.status(403).json({ error: 'CAPTCHA verification failed' });
    }
 
    // Check for required environment variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.TO_EMAIL) {
        console.error('Missing SMTP credentials or TO_EMAIL');
        return res.status(500).json({ error: 'Email configuration error on server' });
    }

    try {
        // 3. Configure the Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Change to your preferred service/host if not using Gmail
            auth: {
                user: process.env.SMTP_USER, // Sender Email (e.g., info@vidhyapat.com)
                pass: process.env.SMTP_PASS, // App Password or equivalent
            },
        });

        const subject = `New Inquiry from ${name}`;
        // Generate a timestamp for the admin notification
        const timestamp = new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Asia/Kolkata'
        });

        // 4. Admin Notification Email (Simple, informational template for your team)
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.TO_EMAIL, // Your designated internal inbox
            subject: `[Vidhyapat] ${subject}`,
            replyTo: email,
            html: `
                <div style="font-family:'Poppins', Arial, sans-serif;background:#f4f6f8;padding:20px;">
                    <div style="background:#fff;border-radius:8px;padding:30px;max-width:600px;margin:auto;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <h2 style="color:#5B1F9D;border-bottom: 2px solid #ddd;padding-bottom:10px;">📬 Vidhyapat New Inquiry</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                        <p><strong>Message:</strong><br>${message}</p>
                        <hr style="margin-top: 20px;">
                        <p style="font-size:0.9em;color:#888;">Submitted on ${timestamp} (Asia/Kolkata)</p>
                    </div>
                </div>
            `
        });

        // 5. User Auto-reply Email (Styled template for the client)
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email, // Reply to the user's email address
            subject: `We’ve Received Your Inquiry, ${name}!`,
            html: `
                <div style="width:100%;background:#f5f5f5;padding:0;margin:0;">
                    <div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;
                    font-family:'Poppins', 'Helvetica Neue', Arial, sans-serif;font-size:16px;line-height:1.7;color:#333;box-shadow: 0 6px 15px rgba(0,0,0,0.15);">

                        <!-- Header with Vidhyapat Branding (Dark Indigo: #5B1F9D) -->
                        <div style="background-color:#5B1F9D; color:#ffffff; text-align:center;padding:2em;">
                            <img src="https://vidhyapat-learning.web.app/assets/images/logo/logo%20black.png" alt="Vidhyapat Logo"
                                        style="height:50px;margin-bottom:10px; border-radius: 4px; display: block; margin-left: auto; margin-right: auto;">
                            <h1 style="margin:0.3em 0 0;font-weight:700;font-size:2em; color:#ffffff;">
                                Inquiry <span style="color:#FFD700;">Confirmed!</span>
                            </h1>
                        </div>

                        <!-- Body -->
                        <div style="padding:1.8em 2.5em;">
                            <p style="margin-top:0;">Hello ${name},</p>
                            <p>Thank you for contacting Vidhyapat Training.<br>
                            We have successfully received your message and our dedicated training counselor team is reviewing your request.<br>
                            We aim to connect with you within <span style="font-weight: bold; color: #5B1F9D;">2 business days</span>.</p>

                            <!-- Inquiry Details -->
                            <div style="margin:25px 0;padding:18px;background:#fcfdff;border-left:4px solid #5B1F9D;border-radius:6px;">
                                <h3 style="margin-top:0;color:#5B1F9D;font-size:1.15em;font-weight:600;">Your Inquiry Details:</h3>
                                <p style="margin:0;font-size:0.95em;">Submitted Message: 
                                <span style="font-style:italic;display:block;margin-top:5px;color:#555;">"${message.substring(0, 100)}..."</span></p>
                            </div>

                            <!-- CTA Button (Primary Color: #5B1F9D) -->
                            <p style="text-align:center;margin-top:40px;margin-bottom:40px;">
                                <a href="https://vidhyapat.com" target="_blank"
                                    style="background:#5B1F9D;color:#fff;text-decoration:none;
                                            padding:14px 28px;border-radius:30px;font-weight:bold;display:inline-block;border: 1px solid #5B1F9D; font-size: 1.05em;">
                                    Explore Our Training
                                </a>
                            </p>

                            <hr style="margin:2em 0; border:none; height:1px; background:#ddd;">
                            <p style="margin: 0 0 12px 0; font-size: 15px; color: #334155;">Best regards,</p>
                            
                            <!-- MODERN SIGNATURE -->
                            <div style="margin-top: 15px; font-family: 'Segoe UI', Arial, sans-serif;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                                    <tr>
                                        <td width="56" style="padding-right: 16px; vertical-align: middle;">
                                            <div style="background: #1a1a2e; padding: 6px; border-radius: 8px;">
                                                <img src="https://vidhyapat-learning.web.app/assets/images/logo/logo%20black.png" alt="Vidhyapat" style="width: 44px; display: block;" />
                                            </div>
                                        </td>
                                        <td style="border-left: 2px solid #5B1F9D; padding-left: 16px; vertical-align: middle;">
                                            <strong style="display: block; font-size: 17px; color: #5B1F9D; margin: 0; letter-spacing: 0.3px;">Team Vidhyapat</strong>
                                            <span style="display: block; font-size: 13px; color: #64748b; margin-top: 4px;">Learn. Discover. Thrive.</span>
                                        </td>
                                    </tr>
                                </table>
                                
                                <div style="font-size: 13.5px; color: #64748b;">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                                        <tr>
                                            <td>
                                                <a href="https://vidhyapat.com" style="color: #5B1F9D; text-decoration: none; font-weight: 600; display: inline-block; margin-right: 12px; margin-bottom: 8px;">
                                                    <span style="margin-right: 4px;">&#12716;</span> vidhyapat.com
                                                </a>
                                                <a href="mailto:teamvidhyapat@gmail.com" style="color: #5B1F9D; text-decoration: none; font-weight: 600; display: inline-block; margin-right: 12px; margin-bottom: 8px;">
                                                    <span style="margin-right: 4px;">&#9993;</span> teamvidhyapat@gmail.com
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px;">
                                        <div style="display: flex; flex-direction: column; gap: 6px;">
                                            <div>
                                                <strong style="color: #334155; font-size: 13px; display: inline-block; width: 90px;">USA / Canada:</strong>
                                                <a href="tel:+12132238844" style="color: #64748b; text-decoration: none; font-size: 13px;">+1 213 223 8844</a>
                                                <span style="color: #cbd5e1; margin: 0 4px;">,</span>
                                                <a href="tel:+12899911346" style="color: #64748b; text-decoration: none; font-size: 13px;">+1 (289) 991-1346</a>
                                            </div>
                                            
                                            <div style="margin-top: 6px;">
                                                <strong style="color: #334155; font-size: 13px; display: inline-block; width: 90px;">India:</strong>
                                                <a href="tel:+917893026644" style="color: #64748b; text-decoration: none; font-size: 13px;">+91 7893026644</a>
                                                <span style="color: #cbd5e1; margin: 0 4px;">,</span>
                                                <a href="tel:+918008919181" style="color: #64748b; text-decoration: none; font-size: 13px;">+91 8008919181</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="background:#e8e8f0;text-align:center;padding:1.2em;font-size:0.85em;color:#666;">
                            &copy; ${new Date().getFullYear()} Vidhyapat. All rights reserved.
                        </div>
                    </div>
                </div>
            `
        });

        // 6. Success Response
        res.status(200).json({ ok: true, status: 'success', message: 'Emails sent successfully.' });
    } catch (err) {
        console.error('Error sending email:', err);
        // 7. Error Response
        res.status(500).json({ error: 'Failed to send email', status: 'error' });
    }
}
