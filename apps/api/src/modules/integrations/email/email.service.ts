import { ApiError } from "../../../errors/api-error.js";
import { ErrorCode } from "../../../errors/error-code.js";
import { OtpPurpose } from "../../otp/otp.model.js";
import { getTransporter } from "./email.config.js";


const getPurposeText = (purpose: OtpPurpose): string => {
  const messages: Record<OtpPurpose, string> = {
    email_verification: "verify your email address",
    forgot_password: "reset your password",
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
    throw new ApiError("Email service is not configured", 500, {
      code: ErrorCode.CONFIGURATION_ERROR,
      description: "The email sender address is not configured.",
    });
  }

  const action = getPurposeText(purpose);

  try {
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
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError("Unable to send verification email", 503, {
      code: ErrorCode.EMAIL_ERROR,
      description: "The verification email could not be delivered.",
    });
  }
};
