"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { DEMO_PASSWORD } from "@/lib/seed-data";
import type { Role } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { BrandMark } from "./BrandMark";

type Mode = "login" | "signup";

const roles: { value: Role; label: string }[] = [
  { value: "investigator", label: "Investigator" },
  { value: "records_clerk", label: "Records clerk" },
  { value: "supervisor", label: "Supervisor" },
  { value: "admin", label: "Admin" },
];

export function AuthScreen({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { login, signup, user, ready } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const message =
      mode === "login"
        ? login(email, password)
        : signup({
            name: String(form.get("name") ?? ""),
            email,
            password,
            badgeNumber: String(form.get("badgeNumber") ?? ""),
            unit: String(form.get("unit") ?? ""),
            role: String(form.get("role") ?? "investigator") as Role,
          });

    setPending(false);
    if (message) {
      setError(message);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden overflow-hidden bg-[#07111f] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,160,23,0.16),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(26,52,84,0.9),transparent_50%)]" />
        <BrandMark />
        <div className="relative max-w-lg">
          <p className="text-xs uppercase tracking-[0.28em] text-[#e8c36a]">
            Restricted system
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-serif)] text-4xl leading-tight text-white">
            Chain-of-custody document control for investigative units.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Encrypted intake, case-linked metadata, and an immutable audit trail
            designed for precinct operations — prototype ready for Saturday demo.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#d4a017]" />
              Role-separated access for Admin, Supervisor, Investigator, Clerk
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#d4a017]" />
              Case ID indexing across files, incidents, and logs
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#d4a017]" />
              Simulated SHA-256 checksums on every upload
            </li>
          </ul>
        </div>
        <p className="relative text-xs text-slate-500">
          Unauthorized access is logged. For authorized personnel only.
        </p>
      </aside>

      <main className="flex items-center justify-center bg-[#0c1b2e] px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <BrandMark />
          </div>
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white">
            {mode === "login" ? "Sign in" : "Request access"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {mode === "login"
              ? "Use your precinct credentials to enter Aegis Records."
              : "Create a prototype account. Data stays in this browser."}
          </p>

          {mode === "login" && (
            <div className="mt-5 rounded-lg border border-[#d4a017]/30 bg-[#d4a017]/8 px-4 py-3 text-sm text-slate-200">
              <p className="font-medium text-[#e8c36a]">Demo credentials</p>
              <p className="mt-1 font-mono text-xs">
                admin@precinct.gov · {DEMO_PASSWORD}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Also: mhale@ / praman@ / jmiles@ precinct.gov
              </p>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <>
                <Field label="Full name" name="name" placeholder="Det. Alex Chen" required />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Badge number" name="badgeNumber" placeholder="B-5501" required />
                  <Field label="Unit" name="unit" placeholder="Major Crimes" required />
                </div>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-slate-300">Role</span>
                  <select
                    name="role"
                    defaultValue="investigator"
                    className="w-full rounded-lg border border-white/10 bg-[#12263d] px-3 py-2.5 text-white outline-none focus:border-[#d4a017]"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
            <Field
              label="Official email"
              name="email"
              type="email"
              placeholder="badge@precinct.gov"
              required
              autoComplete="username"
            />
            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />

            {error && (
              <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-[#d4a017] px-4 py-3 text-sm font-semibold text-[#07111f] transition hover:bg-[#e8c36a] disabled:opacity-60"
            >
              {pending
                ? "Verifying…"
                : mode === "login"
                  ? "Enter secure workspace"
                  : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {mode === "login" ? (
              <>
                Need an account?{" "}
                <Link href="/signup" className="text-[#e8c36a] hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already provisioned?{" "}
                <Link href="/login" className="text-[#e8c36a] hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  minLength,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-slate-300">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-white/10 bg-[#12263d] px-3 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-[#d4a017]"
      />
    </label>
  );
}
