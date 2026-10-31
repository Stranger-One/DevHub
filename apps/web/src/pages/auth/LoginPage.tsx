import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginUser } from "../../features/auth/authThunk";

export function LoginPage() {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = {
      email,
      password,
    };

    try {
      setLoading(true);
      await dispatch(loginUser(formData));
    } finally {
      setLoading(false);
    }
  };

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
      <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
          Email
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          disabled={loading}
          className={`w-full rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold  cursor-pointer text-white hover:bg-primary-hover ${loading ? "cursor-not-allowed opacity-70" : ""}`}
          type="submit"
        >
          {loading ? (
            <LoaderCircle className="animate-spin mx-auto" />
          ) : (
            "Log in"
          )}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-text-secondary">
        New to DevHub?{" "}
        <Link
          className="font-semibold text-accent-purple hover:text-primary-hover"
          to="/auth/register"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
