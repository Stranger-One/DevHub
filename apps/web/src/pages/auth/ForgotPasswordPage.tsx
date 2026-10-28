import { Link } from "react-router-dom";

export function ForgotPasswordPage() {
  return (
    <>
      <span className="text-[0.6875rem] font-bold tracking-[0.16em] text-accent-purple">
        ACCOUNT RECOVERY
      </span>
      <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em]">
        Reset your password
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Enter your email and we'll help you get back in.
      </p>
      <form
        className="mt-8 flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          alert("Connect this form to the password reset endpoint next.");
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
        <button
          className="w-full rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
          type="submit"
        >
          Send reset link
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link
          className="font-semibold text-accent-purple hover:text-primary-hover"
          to="/login"
        >
          ← Back to log in
        </Link>
      </p>
    </>
  );
}
