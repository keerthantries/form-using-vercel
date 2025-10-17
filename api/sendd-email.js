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
                        <div style="background-color:#5B1F9D; /* Dark Indigo background */
                                    color:#ffffff; /* White text color */
                                    text-align:center;padding:2em;">
                            <!-- Logo Image (Using your specified URL) -->
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
                                            padding:14px 28px;border-radius:30px;font-weight:bold;display:inline-block;border: 1px solid #5B1F9D; text-decoration: none; font-size: 1.05em;">
                                    Explore Our Training
                                </a>
                            </p>

                            <hr style="margin:2em 0;border:none;height:1px;background:#ddd;">
                            <p>Best regards,</p>
                            <p style="font-size:1.4em;color:#5B1F9D;margin:0;font-weight:700;">The Vidhyapat Team</p>
                            <!-- CONTACT INFO -->
                            <p style="font-size:0.95em;color:#555;margin:0;">teamvidhyapat@gmail.com | +91 7893024466</p>
                        </div>

                        <!-- Footer -->
                        <div style="background:#e8e8f0;text-align:center;padding:1.2em;font-size:0.85em;color:#666;">
                            &copy; 2025 Vidhyapat. All rights reserved.
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
