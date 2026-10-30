import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { OtpPurpose } from "../models/otp.model.js";

let transporter: Transporter | null = null;

const getTransporter = (): Transporter => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error("SMTP configuration is incomplete");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
};

const getPurposeText = (purpose: OtpPurpose): string => {
  const messages: Record<OtpPurpose, string> = {
    email_verification: "verify your email address",
    password_reset: "reset your password",
    email_change: "verify your new email address",
    two_factor: "complete your two-factor authentication",
  };

  return messages[purpose];
};

export const sendOTPEmail = async (
  email: string,
  code: string,
  purpose: OtpPurpose,
): Promise<void> => {
  const from = process.env.SMTP_FROM;

  if (!from) {
    throw new Error("SMTP_FROM is not configured");
  }

  const action = getPurposeText(purpose);

  await getTransporter().sendMail({
    from,
    to: email,
    subject: "Your DevHub verification code",
    text: `Your OTP to ${action} is ${code}. It expires in 5 minutes. Do not share this code with anyone.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
        <h2>DevHub verification</h2>
        <p>Use the following code to ${action}:</p>
        <h1 style="letter-spacing:8px">${code}</h1>
        <p>This code expires in 5 minutes.</p>
        <p>If you did not request this code, you can ignore this email.</p>
      </div>
    `,
  });
};
