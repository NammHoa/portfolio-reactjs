import nodemailer from "nodemailer";
import { buildContactEmail } from "../utils/contactEmail.js";

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      // Give up quickly when the mail server cannot be reached. The defaults wait about
      // two minutes, and the visitor sits on "Sending..." for all of it: some hosts
      // (Render's free tier, for one) silently drop connections to SMTP ports.
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

// Resend sends mail over plain HTTPS, so it works where SMTP ports are blocked (Render's
// free tier). It is used whenever RESEND_API_KEY is set; otherwise Gmail over SMTP.
async function sendWithResend(mail) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Without a verified domain Resend only allows its own onboarding address as the sender.
      from: process.env.MAIL_FROM || "Portfolio Contact Form <onboarding@resend.dev>",
      to: [process.env.GMAIL_USER],
      reply_to: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(`Resend ${response.status}: ${detail.message ?? "request failed"}`);
  }
}

export async function sendContactNotification({ name, email, message }) {
  const mail = {
    replyTo: email,
    ...buildContactEmail({ name, email, message }),
  };

  if (process.env.RESEND_API_KEY) {
    await sendWithResend(mail);
    return;
  }

  await getTransporter().sendMail({
    from: `"Portfolio Contact Form" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    ...mail,
  });
}
