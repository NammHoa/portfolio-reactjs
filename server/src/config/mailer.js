import nodemailer from "nodemailer";
import { buildContactEmail } from "../utils/contactEmail.js";

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendContactNotification({ name, email, message }) {
  await getTransporter().sendMail({
    from: `"Portfolio Contact Form" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    ...buildContactEmail({ name, email, message }),
  });
}
