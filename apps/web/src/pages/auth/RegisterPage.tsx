import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert(
      `Register form submitted with email: ${email} and password: ${password}. Connect to the backend next.`,
    );
  };

  return (
    <>
      <span className="text-[0.6875rem] font-bold tracking-[0.16em] text-accent-purple">
        START BUILDING
      </span>
      <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em]">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        First, tell us how you want to use DevHub.
      </p>

      <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
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
              autoComplete="new-password"
              minLength={8}
              placeholder="At least 8 characters"
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
        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
          Confirm Password
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm-password"
              autoComplete="new-password"
              minLength={8}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-[10px] border border-border bg-surface-raised px-3.5 py-3 pr-16 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 cursor-pointer text-xs font-semibold text-accent-purple hover:text-primary-hover"
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
        <button
          className="w-full rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
          type="submit"
        >
          Create account
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
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
