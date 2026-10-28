import { useState } from "react";
import { Link } from "react-router-dom";
import type { UserRole } from "../../types/auth.types";

export function RegisterPage() {
  const [role, setRole] = useState<UserRole>("developer");
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
      <div
        className="mt-8 grid gap-3 sm:grid-cols-2"
        role="radiogroup"
        aria-label="Account type"
      >
        <button
          type="button"
          className={
            role === "developer"
              ? "rounded-[10px] border border-primary bg-primary-soft p-4 text-left"
              : "rounded-[10px] border border-border bg-surface-raised p-4 text-left hover:border-border-strong"
          }
          onClick={() => setRole("developer")}
          aria-pressed={role === "developer"}
        >
          <span className="mb-4 grid size-8 place-items-center rounded-lg bg-primary/20 text-accent-purple">
            ⌘
          </span>
          <strong className="block text-sm">I'm a developer</strong>
          <span className="mt-1 block text-xs leading-5 text-text-muted">
            Build projects and find opportunities.
          </span>
        </button>
        <button
          type="button"
          className={
            role === "client"
              ? "rounded-[10px] border border-primary bg-primary-soft p-4 text-left"
              : "rounded-[10px] border border-border bg-surface-raised p-4 text-left hover:border-border-strong"
          }
          onClick={() => setRole("client")}
          aria-pressed={role === "client"}
        >
          <span className="mb-4 grid size-8 place-items-center rounded-lg bg-accent-cyan/10 text-accent-cyan">
            ↗
          </span>
          <strong className="block text-sm">I'm a client</strong>
          <span className="mt-1 block text-xs leading-5 text-text-muted">
            Find talent and bring ideas to life.
          </span>
        </button>
      </div>
      <form
        className="mt-6 flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          alert(
            `Registration UI only. Selected role: ${role}. Connect to the backend next.`,
          );
        }}
      >
        <input type="hidden" name="role" value={role} />
        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
          Username
          <input
            name="username"
            autoComplete="username"
            placeholder="your_username"
            minLength={3}
            maxLength={30}
            className="rounded-[10px] border border-border bg-surface-raised px-3.5 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="rounded-[10px] border border-border bg-surface-raised px-3.5 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
          Password
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            placeholder="At least 8 characters"
            className="rounded-[10px] border border-border bg-surface-raised px-3.5 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </label>
        <button
          className="w-full rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
          type="submit"
        >
          Create {role} account
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
      <p className="mt-6 text-xs leading-5 text-text-muted">
        The server must validate the role and all submitted fields. Never trust
        the selected role from the browser.
      </p>
    </>
  );
}
