"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent, type ReactNode } from "react";
import { Eye, EyeOff, Loader2, CircleCheck, CircleAlert } from "lucide-react";

/* ───────── constants (deterministic demo only — no real auth) ───────── */

const DEMO_EMAIL = "demo@ledgerline.app";
const DEMO_PASSWORD = "demopass123";
const SUBMIT_DELAY_MS = 900;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6E55] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF9]";

const INK = "#14181C";
const MUTED = "#5B6169";
const BORDER = "#8C8577";
const BG = "#FAFAF9";
const ACCENT = "#0E6E55";
const ERROR = "#B3261E";

type Mode = "signin" | "signup";
type Status = "idle" | "submitting" | "success" | "error";

type Touched = { name: boolean; email: boolean; password: boolean };

/* ───────── small presentational pieces ───────── */

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M12 11v2.4h5.3c-.22 1.3-1.62 3.8-5.3 3.8-3.2 0-5.8-2.6-5.8-5.9s2.6-5.9 5.8-5.9c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 3 14.5 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c6.9 0 8.9-4.8 8.9-8.9 0-.6-.1-1.1-.2-1.6H12z"
        fill="currentColor"
      />
    </svg>
  );
}

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="none">
      <path
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
        fill="currentColor"
      />
    </svg>
  );
}

function Hairline() {
  return <div className="h-px w-full shrink-0" style={{ backgroundColor: "#E4E0D6" }} />;
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-start gap-1.5 text-[13px] font-normal leading-snug" style={{ color: ERROR }}>
      <CircleAlert className="mt-[1px] size-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  onBlur,
  autoComplete,
  error,
  disabled,
  trailing,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  autoComplete: string;
  error: string;
  disabled: boolean;
  trailing?: ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold" style={{ color: INK }}>
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          required
          className={
            "w-full min-w-0 rounded-md border bg-transparent px-3.5 py-2.5 text-[15px] font-normal placeholder:text-[#8C8577] disabled:cursor-not-allowed disabled:opacity-60 " +
            (trailing ? "pr-10 " : "") +
            FOCUS
          }
          style={{
            borderColor: error ? ERROR : BORDER,
            color: INK,
          }}
        />
        {trailing ? <div className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</div> : null}
      </div>
      {error ? <FieldError id={errorId} message={error} /> : null}
    </div>
  );
}

/* ───────── main client component ───────── */

export default function LoginClient() {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Touched>({ name: false, email: false, password: false });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const nameError = mode === "signup" && touched.name && name.trim().length === 0 ? "Enter your full name." : "";
  const emailError =
    touched.email && email.length === 0
      ? "Email is required."
      : touched.email && !EMAIL_RE.test(email)
        ? "Enter a valid email address."
        : "";
  const passwordError =
    touched.password && password.length === 0
      ? "Password is required."
      : touched.password && password.length < 8
        ? "Use at least 8 characters."
        : "";

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setPassword("");
    setShowPassword(false);
    setStatus("idle");
    setMessage("");
    setTouched((t) => ({ ...t, password: false, name: next === "signin" ? false : t.name }));
    if (next === "signin") setName("");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    setTouched({ name: mode === "signup", email: true, password: true });

    const hasNameError = mode === "signup" && name.trim().length === 0;
    const hasEmailError = email.length === 0 || !EMAIL_RE.test(email);
    const hasPasswordError = password.length < 8;
    if (hasNameError || hasEmailError || hasPasswordError) return;

    setStatus("submitting");
    setMessage("");

    timerRef.current = setTimeout(() => {
      if (mode === "signin") {
        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
          setStatus("success");
          setMessage("Signed in. Welcome back to Ledgerline. (Demo only — no session was created.)");
        } else {
          setStatus("error");
          setMessage(`We couldn't match that email and password. Try ${DEMO_EMAIL} / ${DEMO_PASSWORD}.`);
        }
      } else {
        if (email === DEMO_EMAIL) {
          setStatus("error");
          setMessage("An account with this email already exists. Try signing in instead.");
        } else {
          setStatus("success");
          setMessage("Account created. Check your inbox to verify your address. (Demo only — no email was sent.)");
        }
      }
    }, SUBMIT_DELAY_MS);
  }

  const submitting = status === "submitting";
  const heading = mode === "signin" ? "Sign in to Ledgerline" : "Create your Ledgerline account";
  const ctaLabel = mode === "signin" ? "Sign in" : "Create account";
  const ctaBusyLabel = mode === "signin" ? "Signing in…" : "Creating account…";

  return (
    <div className="min-h-dvh w-full" style={{ backgroundColor: BG, color: INK }}>
      <main className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-6 py-14 sm:px-8">
        {/* 1. brand lockup */}
        <div>
          <p className="text-[26px] font-extrabold leading-none tracking-tight">Ledgerline</p>
          <p className="mt-3 max-w-[34ch] text-[14px] font-normal leading-relaxed" style={{ color: MUTED }}>
            Invoicing, expenses, and tax set-asides — reconciled automatically for independent freelancers.
          </p>
        </div>

        <div className="my-9">
          <Hairline />
        </div>

        {/* 2. auth form */}
        <h1 className="text-[21px] font-semibold leading-snug tracking-tight">{heading}</h1>

        <p className="mt-2 text-[13px] font-normal leading-relaxed" style={{ color: MUTED }}>
          {mode === "signin" ? (
            <>
              New to Ledgerline?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={"font-semibold underline decoration-1 underline-offset-2 " + FOCUS}
                style={{ color: ACCENT }}
              >
                Create an account
              </button>
              .
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className={"font-semibold underline decoration-1 underline-offset-2 " + FOCUS}
                style={{ color: ACCENT }}
              >
                Sign in
              </button>
              .
            </>
          )}
        </p>

        <form
          className="mt-7 flex flex-col gap-5"
          noValidate
          aria-busy={submitting}
          onSubmit={handleSubmit}
        >
          {mode === "signup" ? (
            <Field
              id="name"
              label="Full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              autoComplete="name"
              error={nameError}
              disabled={submitting}
            />
          ) : null}

          <Field
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            autoComplete="email"
            error={emailError}
            disabled={submitting}
          />

          <div>
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="password" className="block text-[13px] font-semibold" style={{ color: INK }}>
                Password
              </label>
              {mode === "signin" ? (
                <button
                  type="button"
                  onClick={() => setForgotOpen((v) => !v)}
                  aria-expanded={forgotOpen}
                  aria-controls="forgot-note"
                  className={"text-[13px] font-normal underline decoration-1 underline-offset-2 " + FOCUS}
                  style={{ color: MUTED }}
                >
                  Forgot password?
                </button>
              ) : null}
            </div>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                disabled={submitting}
                aria-invalid={passwordError ? "true" : "false"}
                aria-describedby={passwordError ? "password-error" : undefined}
                required
                className={
                  "w-full min-w-0 rounded-md border bg-transparent px-3.5 py-2.5 pr-11 text-[15px] font-normal placeholder:text-[#8C8577] disabled:cursor-not-allowed disabled:opacity-60 " +
                  FOCUS
                }
                style={{ borderColor: passwordError ? ERROR : BORDER, color: INK }}
              />
              <button
                type="button"
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                disabled={submitting}
                className={
                  "absolute inset-y-0 right-1.5 flex items-center rounded px-1.5 disabled:cursor-not-allowed disabled:opacity-60 " +
                  FOCUS
                }
                style={{ color: MUTED }}
              >
                {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
              </button>
            </div>
            {passwordError ? <FieldError id="password-error" message={passwordError} /> : null}
            {!passwordError ? (
              <p className="mt-1.5 text-[12px] font-normal" style={{ color: MUTED }}>
                At least 8 characters.
              </p>
            ) : null}
          </div>

          {forgotOpen && mode === "signin" ? (
            <p
              id="forgot-note"
              className="motion-safe:animate-[login-c-fade_150ms_ease-out] rounded-md border px-3.5 py-2.5 text-[13px] font-normal leading-relaxed"
              style={{ borderColor: "#E4E0D6", color: MUTED }}
            >
              Password recovery isn&apos;t wired up in this demo. Use {DEMO_EMAIL} / {DEMO_PASSWORD} to sign in.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className={
              "mt-1 inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-[14px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-70 " +
              FOCUS
            }
            style={{ backgroundColor: INK, color: BG }}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 shrink-0 motion-safe:animate-spin" aria-hidden="true" />
                {ctaBusyLabel}
              </>
            ) : (
              ctaLabel
            )}
          </button>

          <div
            aria-live={status === "error" ? "assertive" : "polite"}
            role={status === "error" ? "alert" : status === "success" || status === "submitting" ? "status" : undefined}
            className={
              status === "idle"
                ? "sr-only"
                : status === "submitting"
                  ? "sr-only"
                  : "motion-safe:animate-[login-c-fade_150ms_ease-out] flex items-start gap-2 rounded-md border px-3.5 py-2.5 text-[13px] font-normal leading-relaxed"
            }
            style={
              status === "success"
                ? { borderColor: "#BFE2D2", backgroundColor: "#F1F8F5", color: "#0B4A38" }
                : status === "error"
                  ? { borderColor: "#EFC6C1", backgroundColor: "#FBF1F0", color: ERROR }
                  : undefined
            }
          >
            {status === "submitting" ? (
              <span>{ctaBusyLabel}</span>
            ) : status === "success" ? (
              <>
                <CircleCheck className="mt-[1px] size-3.5 shrink-0" aria-hidden="true" />
                <span>{message}</span>
              </>
            ) : status === "error" ? (
              <>
                <CircleAlert className="mt-[1px] size-3.5 shrink-0" aria-hidden="true" />
                <span>{message}</span>
              </>
            ) : null}
          </div>
        </form>

        {/* 3. secondary path */}
        <div className="mt-8 flex items-center gap-3" aria-hidden="true">
          <div className="h-px flex-1" style={{ backgroundColor: "#E4E0D6" }} />
          <span className="text-[12px] font-normal" style={{ color: MUTED }}>
            or continue with
          </span>
          <div className="h-px flex-1" style={{ backgroundColor: "#E4E0D6" }} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={submitting}
            className={
              "inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-[13px] font-normal transition-colors duration-150 hover:bg-[#F0EDE6] disabled:cursor-not-allowed disabled:opacity-60 " +
              FOCUS
            }
            style={{ borderColor: BORDER, color: INK }}
          >
            <GoogleMark className="size-4 shrink-0" />
            Google
          </button>
          <button
            type="button"
            disabled={submitting}
            className={
              "inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-[13px] font-normal transition-colors duration-150 hover:bg-[#F0EDE6] disabled:cursor-not-allowed disabled:opacity-60 " +
              FOCUS
            }
            style={{ borderColor: BORDER, color: INK }}
          >
            <GithubMark className="size-4 shrink-0" />
            GitHub
          </button>
        </div>

        {/* 4 & 5. legal + trust line */}
        <div className="mt-10">
          <Hairline />
          <p className="mt-5 text-[12px] font-normal leading-relaxed tabular-nums" style={{ color: MUTED }}>
            Trusted by 12,400+ independent freelancers.
          </p>
          <p className="mt-2 text-[12px] font-normal leading-relaxed" style={{ color: MUTED }}>
            By continuing, you agree to Ledgerline&apos;s{" "}
            <a href="#" className={"underline decoration-1 underline-offset-2 " + FOCUS} style={{ color: MUTED }}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className={"underline decoration-1 underline-offset-2 " + FOCUS} style={{ color: MUTED }}>
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>

      <style>{`
        @keyframes login-c-fade {
          from { opacity: 0; transform: translateY(-2px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
