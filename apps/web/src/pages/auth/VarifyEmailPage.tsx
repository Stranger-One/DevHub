import { useState } from "react";
import type { UserRole } from "../../types/auth.types";

const VarifyEmailPage = () => {
  const [role, setRole] = useState<UserRole>("developer");

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
      <form
        className="mt-8 flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          alert(
            `Email verification UI only. Selected role: ${role}. Connect to the backend next.`,
          );
        }}
      >
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
              maxLength={6}
              pattern="[0-9]{6}"
              className="w-full rounded-[10px] border border-border bg-surface-raised px-3.5 py-3 text-sm tracking-[0.2em] text-text-primary outline-none placeholder:tracking-normal placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
            <button
              type="button"
              className="cursor-pointer rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover w-44"
            >
              Resend code
            </button>
          </div>
        </label>
        <button
          className="w-full cursor-pointer rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
          type="submit"
        >
          Verify email
        </button>
      </form>
    </>
  );
};

export default VarifyEmailPage;
