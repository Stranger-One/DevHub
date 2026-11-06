import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../../services/api/axiosInstance";
import type { ApiResponse } from "../../types/api.types";

interface ResetPasswordResponse {
  message: string;
}

export function ResetPasswordPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError("");

    if (!id) {
      setValidationError("This password reset link is missing a user ID.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post<
        ApiResponse<ResetPasswordResponse>
      >(
        "/auth/reset-password",
        { id, newPassword, otp },
        { skipAuthRefresh: true },
      );

      toast.success("Password reset successfully", {
        description: response.data.message,
      });
      navigate("/auth/login");
    } catch {
      // Axios interceptor displays the normalized API error toast.
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <span className="text-[0.6875rem] font-bold tracking-[0.16em] text-accent-purple">
        ACCOUNT RECOVERY
      </span>
      <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em]">
        Create a new password
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Enter the OTP from your email and choose a new password.
      </p>
      <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
          One-time password
          <input
            type="text"
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            maxLength={6}
            pattern="[0-9]{6}"
            className="rounded-[10px] border border-border bg-surface-raised px-3.5 py-3 text-sm tracking-[0.2em] text-text-primary outline-none placeholder:tracking-normal placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
          New password
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="new-password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-[10px] border border-border bg-surface-raised px-3.5 py-3 pr-16 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 cursor-pointer text-accent-purple hover:text-primary-hover"
              onClick={() => setShowNewPassword((isVisible) => !isVisible)}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
          Confirm new password
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm-password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-[10px] border border-border bg-surface-raised px-3.5 py-3 pr-16 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 cursor-pointer text-accent-purple hover:text-primary-hover"
              onClick={() => setShowConfirmPassword((isVisible) => !isVisible)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirmed password"
                  : "Show confirmed password"
              }
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </label>
        {validationError && (
          <p className="text-sm text-error" role="alert">
            {validationError}
          </p>
        )}
        <button
          disabled={loading}
          className={`w-full rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
          type="submit"
        >
          {loading ? (
            <LoaderCircle className="mx-auto animate-spin" />
          ) : (
            "Reset password"
          )}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-text-secondary">
        Remember your password?{" "}
        <Link
          className="font-semibold text-accent-purple hover:text-primary-hover"
          to="/auth/login"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
