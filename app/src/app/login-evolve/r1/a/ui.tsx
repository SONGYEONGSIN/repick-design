"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Mountain,
  TrendingUp,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Deterministic demo data                                             */
/* ------------------------------------------------------------------ */

const DEMO_EMAIL = "demo@contour.io";
const DEMO_PASSWORD = "demo1234";

type Mode = "signin" | "signup";
type Status = "idle" | "loading" | "success" | "error";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Trig-derived terrain lines for the brand panel. Fully deterministic. */
function buildContourPath(
  amplitude: number,
  frequency: number,
  phase: number,
  baseline: number,
): string {
  const width = 400;
  const steps = 28;
  const points: string[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = round2(t * width);
    const y = round2(baseline + amplitude * Math.sin(t * Math.PI * 2 * frequency + phase));
    points.push(`${x},${y}`);
  }
  return `M${points.join(" L")}`;
}

const CONTOUR_LINES = [
  { amplitude: 34, frequency: 1.15, phase: 0.4, baseline: 80, opacity: 0.55 },
  { amplitude: 46, frequency: 0.85, phase: 1.9, baseline: 165, opacity: 0.42 },
  { amplitude: 26, frequency: 1.4, phase: 3.1, baseline: 250, opacity: 0.34 },
  { amplitude: 52, frequency: 0.65, phase: 0.9, baseline: 335, opacity: 0.26 },
  { amplitude: 30, frequency: 1.05, phase: 2.4, baseline: 420, opacity: 0.19 },
  { amplitude: 40, frequency: 0.75, phase: 4.2, baseline: 505, opacity: 0.13 },
].map((line, index) => ({
  ...line,
  id: `contour-${index}`,
  d: buildContourPath(line.amplitude, line.frequency, line.phase, line.baseline),
}));

/** Fixed weekly sample — illustrative only, not live data. */
const SPARK_VALUES = [42, 47, 45, 53, 58, 55, 63, 68, 64, 72, 76, 74, 81, 86];

function buildSparklinePoints(values: number[]): string {
  const width = 128;
  const height = 36;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((v, i) => {
      const x = round2((i / (values.length - 1)) * width);
      const y = round2(height - ((v - min) / span) * height);
      return `${x},${y}`;
    })
    .join(" ");
}

const SPARK_POINTS = buildSparklinePoints(SPARK_VALUES);

/* ------------------------------------------------------------------ */
/* Restrained inline provider marks (no emoji, no CSS-shape logos)     */
/* ------------------------------------------------------------------ */

function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" className="h-4 w-4 flex-none" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.85.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.96a9 9 0 0 0 0 8.08l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.4-5.26 5.69.42.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

function getNameError(value: string): string | null {
  if (!value.trim()) return "Full name is required.";
  if (value.trim().length < 2) return "Enter your full name.";
  return null;
}

function getEmailError(value: string): string | null {
  if (!value.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Enter a valid email address.";
  return null;
}

function getPasswordError(value: string, mode: Mode): string | null {
  if (!value) return "Password is required.";
  if (mode === "signup" && value.length < 8) return "Use at least 8 characters.";
  return null;
}

/* ------------------------------------------------------------------ */

export default function LoginClient() {
  const reactId = useId();
  const nameId = `${reactId}-name`;
  const nameErrorId = `${reactId}-name-error`;
  const emailId = `${reactId}-email`;
  const emailErrorId = `${reactId}-email-error`;
  const passwordId = `${reactId}-password`;
  const passwordErrorId = `${reactId}-password-error`;

  const [mode, setMode] = useState<Mode>("signin");
  const [status, setStatus] = useState<Status>("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [formError, setFormError] = useState<string | null>(null);
  const [providerNote, setProviderNote] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const nameError = touched.name && mode === "signup" ? getNameError(fullName) : null;
  const emailError = touched.email ? getEmailError(email) : null;
  const passwordError = touched.password ? getPasswordError(password, mode) : null;

  function switchMode(next: Mode) {
    if (next === mode) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMode(next);
    setStatus("idle");
    setFormError(null);
    setProviderNote(null);
    setTouched({ name: false, email: false, password: false });
    setPassword("");
    setShowPassword(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProviderNote(null);
    setTouched({ name: true, email: true, password: true });

    const nErr = mode === "signup" ? getNameError(fullName) : null;
    const eErr = getEmailError(email);
    const pErr = getPasswordError(password, mode);

    if (nErr || eErr || pErr) {
      if (nErr) nameRef.current?.focus();
      else if (eErr) emailRef.current?.focus();
      else passwordRef.current?.focus();
      return;
    }

    setStatus("loading");
    setFormError(null);

    timeoutRef.current = setTimeout(() => {
      if (mode === "signin") {
        const ok = email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
        if (ok) {
          setStatus("success");
        } else {
          setStatus("error");
          setFormError(
            `We couldn't find a matching account. Use ${DEMO_EMAIL} / ${DEMO_PASSWORD} to preview a signed-in state.`,
          );
        }
      } else {
        const taken = email.trim().toLowerCase() === DEMO_EMAIL;
        if (taken) {
          setStatus("error");
          setFormError("An account with this email already exists. Try signing in instead.");
        } else {
          setStatus("success");
        }
      }
    }, 900);
  }

  const busy = status === "loading";
  const done = status === "success";
  const heading = mode === "signin" ? "Welcome back" : "Create your account";
  const subheading =
    mode === "signin"
      ? "Sign in to pick up where you left off."
      : "Start mapping your product's usage in minutes.";
  const submitLabel = mode === "signin" ? "Sign in" : "Create account";
  const loadingLabel = mode === "signin" ? "Signing in…" : "Creating account…";
  const liveMessage = busy
    ? loadingLabel
    : done
      ? mode === "signin"
        ? "Signed in successfully."
        : "Account created successfully."
      : status === "error"
        ? (formError ?? "Something went wrong.")
        : "";

  return (
    <div className="min-h-screen bg-white text-neutral-900 lg:grid lg:grid-cols-2 dark:bg-neutral-950 dark:text-neutral-50">
      {/* ---------------------------------------------------------- */}
      {/* Left: brand / generative visual panel                      */}
      {/* ---------------------------------------------------------- */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0B0B12] px-10 py-10 lg:flex xl:px-16 xl:py-14">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 400 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <rect width="400" height="600" fill="#0B0B12" />
          {CONTOUR_LINES.map((line) => (
            <path
              key={line.id}
              d={line.d}
              fill="none"
              stroke="#A78BFA"
              strokeOpacity={line.opacity}
              strokeWidth={1.5}
            />
          ))}
        </svg>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 10%, rgba(110,86,207,0.35) 0%, rgba(11,11,18,0) 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-2.5">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
            <Mountain className="h-4.5 w-4.5 text-white" aria-hidden="true" />
          </span>
          <div>
            <p className="text-lg leading-none font-bold tracking-tight text-white">Contour</p>
          </div>
        </div>

        <div className="relative max-w-xs">
          <p className="text-2xl leading-snug font-bold tracking-tight text-white text-balance">
            See your product&apos;s shape, not just its numbers.
          </p>
          <p className="mt-3 text-sm leading-relaxed font-normal text-white/70">
            Contour turns raw usage telemetry into terrain you can read at a glance — built for
            teams who ship fast and can&apos;t afford to guess.
          </p>

          <div className="mt-8 w-full max-w-[17rem] rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-white/70">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="text-xs font-normal">Signal coverage</span>
              </div>
              <span
                className="h-1.5 w-1.5 flex-none rounded-full bg-emerald-400 motion-safe:animate-pulse"
                aria-hidden="true"
              />
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white tabular-nums">
              98.4<span className="text-lg text-white/50">%</span>
            </p>
            <svg viewBox="0 0 128 36" className="mt-3 h-9 w-full" aria-hidden="true">
              <polyline
                points={SPARK_POINTS}
                fill="none"
                stroke="#A78BFA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-xs font-normal text-white/50">
              Workspace preview · Acme Robotics
            </p>
          </div>
        </div>

        <p className="relative text-xs font-normal text-white/40">
          Trusted by engineering teams building the next generation of hardware and software.
        </p>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Right: auth form panel                                     */}
      {/* ---------------------------------------------------------- */}
      <main className="flex min-h-screen flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:min-h-0 lg:px-14 xl:px-20">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[#6E56CF]/10 ring-1 ring-[#6E56CF]/20">
              <Mountain className="h-4 w-4 text-[#6E56CF]" aria-hidden="true" />
            </span>
            <p className="text-base leading-none font-bold tracking-tight">Contour</p>
          </div>

          {/* Mode switch */}
          <div
            role="group"
            aria-label="Choose sign in or create account"
            className="mb-7 grid grid-cols-2 gap-1 rounded-full bg-neutral-100 p-1 dark:bg-neutral-900"
          >
            <button
              type="button"
              aria-pressed={mode === "signin"}
              onClick={() => switchMode("signin")}
              className={`rounded-full px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 ${
                mode === "signin"
                  ? "bg-white font-semibold text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                  : "font-normal text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              aria-pressed={mode === "signup"}
              onClick={() => switchMode("signup")}
              className={`rounded-full px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 ${
                mode === "signup"
                  ? "bg-white font-semibold text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                  : "font-normal text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              Create account
            </button>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {heading}
          </h1>
          <p className="mt-1.5 text-sm font-normal text-neutral-600 dark:text-neutral-400">
            {subheading}
          </p>

          <form
            className="mt-6 space-y-4"
            noValidate
            aria-busy={busy}
            onSubmit={handleSubmit}
          >
            {mode === "signup" && (
              <div>
                <label
                  htmlFor={nameId}
                  className="mb-1.5 block text-sm font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  Full name
                </label>
                <input
                  ref={nameRef}
                  id={nameId}
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? nameErrorId : undefined}
                  disabled={busy || done}
                  className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm outline-none transition-colors placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-[#6E56CF] disabled:opacity-60 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-600 ${
                    nameError
                      ? "border-red-400 dark:border-red-500/70"
                      : "border-neutral-300 focus-visible:border-[#6E56CF] dark:border-neutral-700"
                  }`}
                  placeholder="Jordan Reyes"
                />
                {nameError && (
                  <p
                    id={nameErrorId}
                    className="mt-1.5 flex items-center gap-1.5 text-sm font-normal text-red-700 dark:text-red-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
                    {nameError}
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor={emailId}
                className="mb-1.5 block text-sm font-semibold text-neutral-800 dark:text-neutral-200"
              >
                Email address
              </label>
              <input
                ref={emailRef}
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? emailErrorId : undefined}
                disabled={busy || done}
                className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm outline-none transition-colors placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-[#6E56CF] disabled:opacity-60 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-600 ${
                  emailError
                    ? "border-red-400 dark:border-red-500/70"
                    : "border-neutral-300 focus-visible:border-[#6E56CF] dark:border-neutral-700"
                }`}
                placeholder="you@company.com"
              />
              {emailError && (
                <p
                  id={emailErrorId}
                  className="mt-1.5 flex items-center gap-1.5 text-sm font-normal text-red-700 dark:text-red-400"
                >
                  <AlertCircle className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor={passwordId}
                  className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  Password
                </label>
                {mode === "signin" && (
                  <a
                    href="#forgot-password"
                    className="rounded text-sm font-normal text-[#6E56CF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  ref={passwordRef}
                  id={passwordId}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={passwordError ? passwordErrorId : undefined}
                  disabled={busy || done}
                  className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 pr-11 text-sm text-neutral-900 shadow-sm outline-none transition-colors placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-[#6E56CF] disabled:opacity-60 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-600 ${
                    passwordError
                      ? "border-red-400 dark:border-red-500/70"
                      : "border-neutral-300 focus-visible:border-[#6E56CF] dark:border-neutral-700"
                  }`}
                  placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                />
                <button
                  type="button"
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={busy || done}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-neutral-500 outline-none transition-colors hover:text-neutral-800 focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-inset disabled:opacity-60 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p
                  id={passwordErrorId}
                  className="mt-1.5 flex items-center gap-1.5 text-sm font-normal text-red-700 dark:text-red-400"
                >
                  <AlertCircle className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
                  {passwordError}
                </p>
              )}
            </div>

            {status === "error" && formError && (
              <div
                role="alert"
                aria-live="assertive"
                className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm font-normal text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                <p>{formError}</p>
              </div>
            )}

            {status === "success" && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-start gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 text-sm font-normal text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                <p>
                  {mode === "signin"
                    ? "Signed in. Redirecting to your workspace…"
                    : "Account created. Redirecting to your workspace…"}
                </p>
              </div>
            )}

            <span className="sr-only" aria-live="polite">
              {liveMessage}
            </span>

            <button
              type="submit"
              disabled={busy || done}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6E56CF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5d47b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-neutral-950"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  {loadingLabel}
                </>
              ) : done ? (
                <>
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {mode === "signin" ? "Signed in" : "Account created"}
                </>
              ) : (
                <>
                  {submitLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            <span className="text-xs font-normal text-neutral-500 dark:text-neutral-500">
              or continue with
            </span>
            <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setProviderNote("Google sign-in isn't wired up in this preview.")}
              className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-950"
            >
              <GoogleMark />
              Google
            </button>
            <button
              type="button"
              onClick={() => setProviderNote("GitHub sign-in isn't wired up in this preview.")}
              className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-950"
            >
              <GithubMark />
              GitHub
            </button>
          </div>
          <p className="mt-2.5 min-h-4 text-xs font-normal text-neutral-500 dark:text-neutral-500" aria-live="polite">
            {providerNote}
          </p>

          <p className="mt-5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400">
            {mode === "signin" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="rounded font-semibold text-[#6E56CF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="rounded font-semibold text-[#6E56CF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

          <p className="mt-6 text-center text-xs font-normal text-neutral-500 dark:text-neutral-500">
            By continuing, you agree to Contour&apos;s{" "}
            <a
              href="#terms"
              className="rounded underline decoration-neutral-300 underline-offset-2 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] dark:decoration-neutral-700 dark:hover:text-neutral-300"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#privacy"
              className="rounded underline decoration-neutral-300 underline-offset-2 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] dark:decoration-neutral-700 dark:hover:text-neutral-300"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
