"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  Lock,
  LoaderCircle,
  Mail,
  User,
} from "lucide-react";
import { GitHubMark, GoogleMark, MeridianMark, MicrosoftMark } from "./icons";

/* ------------------------------------------------------------------ */
/* Deterministic demo "backend" — no network, no randomness, no Date. */
/* ------------------------------------------------------------------ */
const DEMO_EMAIL = "demo@meridian.app";
const DEMO_PASSWORD = "meridian2026";
const AUTH_DELAY_MS = 900;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Mode = "signin" | "signup";
type SubmitResult = "idle" | "success" | "error";

function getEmailError(value: string): string {
  if (!value.trim()) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(value.trim())) return "Enter a valid email, like name@company.com.";
  return "";
}

function getPasswordError(value: string, mode: Mode): string {
  if (!value) return mode === "signup" ? "Create a password." : "Enter your password.";
  if (mode === "signup" && value.length < 8) return "Use at least 8 characters.";
  return "";
}

function getNameError(value: string): string {
  if (!value.trim()) return "Enter your full name.";
  return "";
}

function getConfirmError(value: string, password: string): string {
  if (!value) return "Confirm your password.";
  if (value !== password) return "Passwords don't match.";
  return "";
}

/* ------------------------------------------------------------------ */
/* Decorative full-bleed background — a stylised "meridian grid" on a */
/* midnight sky, evoking global time zones. Purely presentational.    */
/* ------------------------------------------------------------------ */
function BackgroundArt() {
  // Longitude ellipses: cx=720 cy=460, ry=380, rx = 380 * cos(deg)
  const longitudes = [380, 367.05, 329.09, 268.7, 190, 98.35];
  // Latitude chords: y = 460 + dy, half-width = sqrt(380^2 - dy^2)
  const latitudes: Array<{ dy: number; half: number }> = [
    { dy: -329.09, half: 190 },
    { dy: -190, half: 329.09 },
    { dy: 0, half: 380 },
    { dy: 190, half: 329.09 },
    { dy: 329.09, half: 190 },
  ];
  const markers: Array<{ x: number; y: number }> = [
    { x: 1001.91, y: 523.62 },
    { x: 705.18, y: 565.0 },
    { x: 438.09, y: 523.62 },
    { x: 565.93, y: 415.46 },
    { x: 667.91, y: 276.83 },
    { x: 850.23, y: 392.25 },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-[#050914]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 78% 12%, #17204a 0%, #0a0f26 42%, #050914 78%)",
        }}
      />
      <div
        className="absolute -right-24 -top-24 h-[560px] w-[560px] rounded-full opacity-40 blur-3xl motion-safe:animate-pulse"
        style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)", animationDuration: "6s" }}
      />
      <div
        className="absolute -bottom-32 left-[-10%] h-[520px] w-[520px] rounded-full opacity-30 blur-3xl motion-safe:animate-pulse"
        style={{ background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)", animationDuration: "7s", animationDelay: "0.6s" }}
      />
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <g stroke="#8fb4ff" strokeOpacity="0.16" fill="none" strokeWidth="1">
          {longitudes.map((rx) => (
            <ellipse key={rx} cx="720" cy="460" rx={rx} ry="380" />
          ))}
          {latitudes.map((lat) => (
            <line
              key={lat.dy}
              x1={720 - lat.half}
              y1={460 + lat.dy}
              x2={720 + lat.half}
              y2={460 + lat.dy}
            />
          ))}
        </g>
        {markers.map((m, i) => (
          <g key={`${m.x}-${m.y}`}>
            <circle cx={m.x} cy={m.y} r="10" fill="#fbbf24" opacity="0.12" />
            <circle
              cx={m.x}
              cy={m.y}
              r="2.4"
              fill="#fde68a"
              className="motion-safe:animate-pulse"
              style={{ animationDuration: "3s", animationDelay: `${(i * 0.35).toFixed(2)}s` }}
            />
          </g>
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-[#020509]/80 via-transparent to-[#020509]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020509]/55 via-transparent to-transparent" />
    </div>
  );
}

const focusRing =
  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300";

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-start gap-1.5 text-[13px] font-normal leading-snug text-rose-300">
      <CircleAlert className="mt-[1px] h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

export default function MeridianAuth() {
  const [mode, setMode] = useState<Mode>("signin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult>("idle");
  const [formError, setFormError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const emailError = getEmailError(email);
  const passwordError = getPasswordError(password, mode);
  const nameError = mode === "signup" ? getNameError(name) : "";
  const confirmError = mode === "signup" ? getConfirmError(confirmPassword, password) : "";

  const hasBlockingErrors =
    !!emailError || !!passwordError || (mode === "signup" && (!!nameError || !!confirmError));

  const show = (field: string) => touched[field] || attemptedSubmit;

  function markTouched(field: string) {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  }

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setTouched({});
    setAttemptedSubmit(false);
    setSubmitResult("idle");
    setFormError("");
    setForgotSent(false);
    setPassword("");
    setConfirmPassword("");
    setName("");
    setShowPassword(false);
    setShowConfirm(false);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttemptedSubmit(true);
    setFormError("");
    if (hasBlockingErrors) return;

    setSubmitting(true);
    setSubmitResult("idle");
    timeoutRef.current = setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();
      if (mode === "signin") {
        if (normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
          setSubmitting(false);
          setSubmitResult("success");
        } else {
          setSubmitting(false);
          setSubmitResult("error");
          setFormError(
            `We couldn't find a match for those details. Use the demo account ${DEMO_EMAIL} / ${DEMO_PASSWORD}.`,
          );
        }
      } else {
        if (normalizedEmail === DEMO_EMAIL) {
          setSubmitting(false);
          setSubmitResult("error");
          setFormError("An account with this email already exists — try signing in instead.");
        } else {
          setSubmitting(false);
          setSubmitResult("success");
        }
      }
    }, AUTH_DELAY_MS);
  }

  function resetToIdle() {
    setSubmitResult("idle");
    setFormError("");
    setAttemptedSubmit(false);
  }

  const liveMessage = submitting
    ? mode === "signin"
      ? "Signing in…"
      : "Creating your account…"
    : submitResult === "success"
      ? mode === "signin"
        ? "Signed in successfully."
        : "Account created successfully."
      : submitResult === "error"
        ? formError
        : "";

  const segBase =
    "flex-1 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors " + focusRing;

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden text-white">
      <style>{`
        @keyframes meridian-card-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .meridian-card-enter {
          animation: meridian-card-in 0.5s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .meridian-card-enter {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
      <BackgroundArt />

      <div className="relative z-10 flex min-h-dvh w-full flex-col">
        <header className="flex items-center justify-between gap-4 px-5 py-6 sm:px-10 sm:py-8">
          <div className="flex items-center gap-2.5 rounded-full bg-black/25 px-3.5 py-2 backdrop-blur-sm">
            <MeridianMark className="h-6 w-6 text-amber-300" />
            <span className="text-[15px] font-bold tracking-tight">Meridian</span>
          </div>
          <p className="hidden max-w-[16rem] rounded-full bg-black/25 px-3.5 py-2 text-right text-[12px] font-normal text-white/85 backdrop-blur-sm sm:block">
            Scheduling that respects everyone&rsquo;s midnight.
          </p>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-10 px-5 pb-8 lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:px-16 xl:gap-24">
          {/* Hero copy — the sole H1 on the page */}
          <div className="w-full max-w-md lg:max-w-lg">
            <h1 className="text-[2.1rem] font-bold leading-[1.08] tracking-tight sm:text-[2.6rem]">
              Every meeting, on time, in every time zone.
            </h1>
            <p className="mt-4 max-w-md text-[15px] font-normal leading-relaxed text-white/85 sm:text-base">
              Meridian finds the window that works for your whole team — no more 6&nbsp;a.m. calls
              for someone by accident. Sign in to see today&rsquo;s shared schedule.
            </p>
            <p className="mt-6 text-[13px] font-semibold tracking-wide text-white/70">
              Coordinating across{" "}
              <span className="tabular-nums text-amber-300">24</span> time zones for{" "}
              <span className="tabular-nums text-amber-300">3,200+</span> teams
            </p>
          </div>

          {/* Auth card */}
          <div className="meridian-card-enter w-full max-w-md rounded-3xl border border-white/12 bg-slate-950/85 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8">
            <div role="group" aria-label="Choose sign in or create account" className="mb-6 flex rounded-full border border-white/15 bg-white/5 p-1">
              <button
                type="button"
                aria-pressed={mode === "signin"}
                onClick={() => switchMode("signin")}
                className={segBase + (mode === "signin" ? " bg-amber-300 text-slate-950" : " text-white/70 hover:text-white")}
              >
                Sign in
              </button>
              <button
                type="button"
                aria-pressed={mode === "signup"}
                onClick={() => switchMode("signup")}
                className={segBase + (mode === "signup" ? " bg-amber-300 text-slate-950" : " text-white/70 hover:text-white")}
              >
                Create account
              </button>
            </div>

            <div aria-live="polite" className="sr-only">
              {liveMessage}
            </div>

            {submitResult === "success" ? (
              <div className="flex flex-col items-start gap-4 py-2" role="status">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <CircleCheck className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-bold">
                    {mode === "signin" ? "Welcome back" : "You're all set"}
                  </h2>
                  <p className="mt-1.5 text-[14px] font-normal leading-relaxed text-white/80">
                    {mode === "signin"
                      ? "Signed in as demo@meridian.app. Redirecting to your shared schedule."
                      : "Your Meridian workspace is ready. A verification link has been sent to your inbox."}
                  </p>
                </div>
                <button type="button" onClick={resetToIdle} className={"rounded-full border border-white/20 px-4 py-2 text-[13px] font-semibold text-white/85 hover:bg-white/10 " + focusRing}>
                  Start over
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold tracking-tight">
                  {mode === "signin" ? "Sign in to your workspace" : "Create your account"}
                </h2>
                <p className="mt-1 text-[13px] font-normal text-white/60">
                  {mode === "signin"
                    ? "Use demo@meridian.app / meridian2026 to preview the product."
                    : "Takes about a minute — no credit card required."}
                </p>

                <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                  {mode === "signup" && (
                    <div>
                      <label htmlFor="name-input" className="mb-1.5 block text-[13px] font-semibold text-white/85">
                        Full name
                      </label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden="true" />
                        <input
                          id="name-input"
                          name="name"
                          type="text"
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onBlur={() => markTouched("name")}
                          aria-invalid={show("name") && !!nameError}
                          aria-describedby={show("name") && nameError ? "name-error" : undefined}
                          className={
                            "w-full rounded-xl border bg-white/[0.06] py-2.5 pl-10 pr-3 text-[14px] font-normal text-white placeholder:text-white/35 " +
                            focusRing +
                            (show("name") && nameError ? " border-rose-400/70" : " border-white/15")
                          }
                          placeholder="Ada Lovelace"
                        />
                      </div>
                      {show("name") && nameError && <FieldError id="name-error" message={nameError} />}
                    </div>
                  )}

                  <div>
                    <label htmlFor="email-input" className="mb-1.5 block text-[13px] font-semibold text-white/85">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden="true" />
                      <input
                        id="email-input"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => markTouched("email")}
                        aria-invalid={show("email") && !!emailError}
                        aria-describedby={show("email") && emailError ? "email-error" : undefined}
                        className={
                          "w-full rounded-xl border bg-white/[0.06] py-2.5 pl-10 pr-3 text-[14px] font-normal text-white placeholder:text-white/35 " +
                          focusRing +
                          (show("email") && emailError ? " border-rose-400/70" : " border-white/15")
                        }
                        placeholder="you@company.com"
                      />
                    </div>
                    {show("email") && emailError && <FieldError id="email-error" message={emailError} />}
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label htmlFor="password-input" className="block text-[13px] font-semibold text-white/85">
                        {mode === "signup" ? "Create a password" : "Password"}
                      </label>
                      {mode === "signin" && (
                        <button
                          type="button"
                          onClick={() => setForgotSent(true)}
                          className={"text-[12px] font-semibold text-amber-300 hover:text-amber-200 " + focusRing}
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden="true" />
                      <input
                        id="password-input"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => markTouched("password")}
                        aria-invalid={show("password") && !!passwordError}
                        aria-describedby={show("password") && passwordError ? "password-error" : undefined}
                        className={
                          "w-full rounded-xl border bg-white/[0.06] py-2.5 pl-10 pr-11 text-[14px] font-normal text-white placeholder:text-white/35 " +
                          focusRing +
                          (show("password") && passwordError ? " border-rose-400/70" : " border-white/15")
                        }
                        placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                      />
                      <button
                        type="button"
                        aria-pressed={showPassword}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((v) => !v)}
                        className={"absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/50 hover:text-white " + focusRing}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    </div>
                    {show("password") && passwordError && <FieldError id="password-error" message={passwordError} />}
                    {mode === "signin" && forgotSent && (
                      <p role="status" className="mt-1.5 flex items-center gap-1.5 text-[12px] font-normal text-emerald-300">
                        <CircleCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        If that address is registered, reset instructions are on the way.
                      </p>
                    )}
                  </div>

                  {mode === "signup" && (
                    <div>
                      <label htmlFor="confirm-input" className="mb-1.5 block text-[13px] font-semibold text-white/85">
                        Confirm password
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden="true" />
                        <input
                          id="confirm-input"
                          name="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onBlur={() => markTouched("confirm")}
                          aria-invalid={show("confirm") && !!confirmError}
                          aria-describedby={show("confirm") && confirmError ? "confirm-error" : undefined}
                          className={
                            "w-full rounded-xl border bg-white/[0.06] py-2.5 pl-10 pr-11 text-[14px] font-normal text-white placeholder:text-white/35 " +
                            focusRing +
                            (show("confirm") && confirmError ? " border-rose-400/70" : " border-white/15")
                          }
                          placeholder="Retype your password"
                        />
                        <button
                          type="button"
                          aria-pressed={showConfirm}
                          aria-label={showConfirm ? "Hide password" : "Show password"}
                          onClick={() => setShowConfirm((v) => !v)}
                          className={"absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/50 hover:text-white " + focusRing}
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                        </button>
                      </div>
                      {show("confirm") && confirmError && <FieldError id="confirm-error" message={confirmError} />}
                    </div>
                  )}

                  {submitResult === "error" && formError && (
                    <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2.5 text-[13px] font-normal leading-snug text-rose-200">
                      <CircleAlert className="mt-[1px] h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{formError}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    aria-busy={submitting}
                    disabled={submitting}
                    className={
                      "mt-1 flex items-center justify-center gap-2 rounded-xl bg-amber-300 py-2.5 text-[14px] font-bold text-slate-950 transition-colors hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-80 " +
                      focusRing
                    }
                  >
                    {submitting && (
                      <LoaderCircle className="h-4 w-4 motion-safe:animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    )}
                    {submitting
                      ? mode === "signin"
                        ? "Signing in…"
                        : "Creating account…"
                      : mode === "signin"
                        ? "Sign in"
                        : "Create account"}
                  </button>
                </form>

                <div className="mt-6 flex items-center gap-3 text-[12px] font-semibold text-white/40">
                  <span className="h-px flex-1 bg-white/12" />
                  or continue with
                  <span className="h-px flex-1 bg-white/12" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    className={"flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] py-3 text-white/85 transition-colors hover:border-white/30 hover:bg-white/[0.08] " + focusRing}
                  >
                    <GoogleMark className="h-4 w-4" />
                    <span className="text-[11px] font-semibold">Google</span>
                  </button>
                  <button
                    type="button"
                    className={"flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] py-3 text-white/85 transition-colors hover:border-white/30 hover:bg-white/[0.08] " + focusRing}
                  >
                    <MicrosoftMark className="h-4 w-4" />
                    <span className="text-[11px] font-semibold">Microsoft</span>
                  </button>
                  <button
                    type="button"
                    className={"flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] py-3 text-white/85 transition-colors hover:border-white/30 hover:bg-white/[0.08] " + focusRing}
                  >
                    <GitHubMark className="h-4 w-4" />
                    <span className="text-[11px] font-semibold">GitHub</span>
                  </button>
                </div>

                <p className="mt-6 text-center text-[13px] font-normal text-white/65">
                  {mode === "signin" ? "New to Meridian?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                    className={"font-semibold text-amber-300 hover:text-amber-200 " + focusRing}
                  >
                    {mode === "signin" ? "Create an account" : "Sign in"}
                  </button>
                </p>
              </>
            )}
          </div>
        </main>

        <footer className="px-5 pb-6 sm:px-10 sm:pb-8">
          <div className="inline-flex flex-wrap items-center gap-x-2 rounded-full bg-black/25 px-3.5 py-2 text-[12px] font-normal leading-relaxed text-white/70 backdrop-blur-sm">
            <span>&copy; 2026 Meridian Labs.</span>
            <span>By continuing you agree to our</span>
            <button type="button" className={"font-semibold text-white/85 underline decoration-white/30 underline-offset-2 hover:text-white " + focusRing}>
              Terms
            </button>
            <span>and</span>
            <button type="button" className={"font-semibold text-white/85 underline decoration-white/30 underline-offset-2 hover:text-white " + focusRing}>
              Privacy Policy
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
