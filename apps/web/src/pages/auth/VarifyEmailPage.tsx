import { useEffect, useState } from "react";
import type { UserRole } from "../../types/auth.types";
import { useAppDispatch } from "../../app/hooks";
import { LoaderCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { verifyEmail } from "../../features/auth/authThunk";
import { toast } from "sonner";
import axiosInstance from "../../services/api/axiosInstance";

const VarifyEmailPage = () => {
  const [role, setRole] = useState<UserRole>("developer");
  const [username, setUsername] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState<boolean>(false);
  const [resendCodeLoading, setResendCodeLoading] = useState(false);

  const [countDown, setCountDown] = useState(60);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (countDown === 0) return;

    const timeout = window.setTimeout(() => {
      setCountDown((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [countDown]);

  const handleResendCode = async () => {
    if (!id) {
      toast.error("Missing Field", {
        description: "User ID is missing. Please go back and try again.",
      });
      return;
    }

    try {
      setResendCodeLoading(true);
      const response = await axiosInstance.post("/auth/register/resend-otp", {
        id,
      });

      if (response.data.success) {
        setCountDown(60);
        toast.success("Verification code resent!", {
          description: "Please check your email for the new verification code.",
        });
      }
    } catch {
    } finally {
      setResendCodeLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = {
      id: id || "",
      role,
      username,
      otp,
    };

    if (!id) {
      toast.error("Missing Field", {
        description: "User ID is missing. Please go back and try again.",
      });
      return;
    }

    try {
      setLoading(true);
      await dispatch(verifyEmail(formData)).unwrap();
      toast.success("Email verified successfully!", {
        description: "Your DevHub account is ready.",
      });
    } catch {
      // The API interceptor displays the normalized error toast.
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <span className="text-[0.6875rem] font-bold tracking-[0.16em] text-accent-purple">
        EMAIL VERIFICATION
      </span>
      <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em]">
        Verify your email
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Enter your account details and the code we sent to your email.
      </p>
      <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
        <div
          className=" grid gap-3 sm:grid-cols-2"
          role="radiogroup"
          aria-label="Account type"
        >
          <button
            type="button"
            className={
              role === "developer"
                ? "rounded-[10px] border border-primary bg-primary-soft p-4 text-left cursor-pointer"
                : "rounded-[10px] border border-border bg-surface-raised p-4 text-left cursor-pointer hover:border-border-strong"
            }
            onClick={() => setRole("developer")}
            aria-pressed={role === "developer"}
          >
            <span className="mb-4 grid size-8 place-items-center rounded-lg bg-primary/20 text-accent-purple">
              ⌘
            </span>
            <strong className="block text-sm">I'm a Developer</strong>
            <span className="mt-1 block text-xs leading-4 text-text-muted">
              Build projects and find opportunities.
            </span>
          </button>
          <button
            type="button"
            className={
              role === "client"
                ? "rounded-[10px] border border-primary bg-primary-soft p-4 text-left cursor-pointer"
                : "rounded-[10px] border border-border bg-surface-raised p-4 text-left cursor-pointer hover:border-border-strong"
            }
            onClick={() => setRole("client")}
            aria-pressed={role === "client"}
          >
            <span className="mb-4 grid size-8 place-items-center rounded-lg bg-accent-cyan/10 text-accent-cyan">
              ↗
            </span>
            <strong className="block text-sm">I'm a Client</strong>
            <span className="mt-1 block text-xs leading-4 text-text-muted">
              Find talent and bring ideas to life.
            </span>
          </button>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
          Username
          <input
            type="text"
            name="username"
            autoComplete="username"
            placeholder="your-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-[10px] border border-border bg-surface-raised px-3.5 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary ">
          One-time password
          <div className="w-full flex items-center gap-3">
            <input
              type="text"
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              pattern="[0-9]{6}"
              className="w-full rounded-[10px] border border-border bg-surface-raised px-3.5 py-3 text-sm tracking-[0.2em] text-text-primary outline-none placeholder:tracking-normal placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
            <button
              type="button"
              disabled={resendCodeLoading || countDown > 0}
              className={`rounded-[10px] bg-primary px-3 py-3 min-w-44 text-nowrap text-sm font-semibold  cursor-pointer text-white hover:bg-primary-hover ${resendCodeLoading ? "cursor-not-allowed opacity-70" : ""}`}
              onClick={handleResendCode}
            >
              {resendCodeLoading ? (
                <LoaderCircle className="animate-spin mx-auto" />
              ) : countDown > 0 ? (
                `Resend Code (${countDown}s)`
              ) : (
                "Resend Code"
              )}
            </button>
          </div>
        </label>
        <button
          disabled={loading}
          className={`w-full rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold  cursor-pointer text-white hover:bg-primary-hover ${loading ? "cursor-not-allowed opacity-70" : ""}`}
          type="submit"
        >
          {loading ? (
            <LoaderCircle className="animate-spin mx-auto" />
          ) : (
            "Verify Email"
          )}
        </button>
      </form>
    </>
  );
};

export default VarifyEmailPage;
