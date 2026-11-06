import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/api/axiosInstance";
import type { ApiResponse } from "../../types/api.types";

interface ForgotPasswordResponse {
  user: { id: string };
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await axiosInstance.post<
        ApiResponse<ForgotPasswordResponse>
      >("/auth/forgot-password", { email }, { skipAuthRefresh: true });

      navigate(`/auth/reset-password/${response.data.data.user.id}`);
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
        Reset your password
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Enter your email and we&apos;ll send you a password reset OTP.
      </p>
      <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
          Email
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-[10px] border border-border bg-surface-raised px-3.5 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </label>
        <button
          disabled={loading}
          className={`w-full rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
          type="submit"
        >
          {loading ? (
            <LoaderCircle className="mx-auto animate-spin" />
          ) : (
            "Send reset code"
          )}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link
          className="font-semibold text-accent-purple hover:text-primary-hover"
          to="/auth/login"
        >
          ← Back to log in
        </Link>
      </p>
    </>
  );
}
