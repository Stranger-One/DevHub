import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { ApiError } from "../../../errors/api-error.js";
import { ErrorCode } from "../../../errors/error-code.js";

let transporter: Transporter | null = null;

export const getTransporter = (): Transporter => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new ApiError("Email service is not configured", 500, {
      code: ErrorCode.CONFIGURATION_ERROR,
      description: "The email service configuration is incomplete.",
    });
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
};
