import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from
    ?.pathname;
  return (
    <>
      <span className="text-[0.6875rem] font-bold tracking-[0.16em] text-accent-purple">
        WELCOME BACK
      </span>
      <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em]">
        Log in to DevHub
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Pick up where you left off.
      </p>
      <form
        className="mt-8 flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          alert("Connect this form to the backend login endpoint next.");
        }}
      >
        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
          Email
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="rounded-[10px] border border-border bg-surface-raised px-3.5 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
          Password
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Your password"
              autoComplete="current-password"
              className="w-full rounded-[10px] border border-border bg-surface-raised px-3.5 py-3 pr-16 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 cursor-pointer text-xs font-semibold text-accent-purple hover:text-primary-hover"
              onClick={() => setShowPassword((isVisible) => !isVisible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </label>
        <div className="flex justify-end text-sm">
          <Link
            className="text-accent-purple hover:text-primary-hover"
            to="/auth/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
        <button
          className="w-full rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
          type="submit"
        >
          Log in
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-text-secondary">
        New to DevHub?{" "}
        <Link
          className="font-semibold text-accent-purple hover:text-primary-hover"
          to="/auth/register"
          state={{ from }}
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
