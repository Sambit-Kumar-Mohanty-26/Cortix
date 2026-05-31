"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Loader2, AlertCircle, Check, Copy, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "./auth.css";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

type Tab = "signup" | "login";
type Role = "examiner" | "candidate";

interface FormState {
  name: string;
  email: string;
  password: string;
}

interface SuccessData {
  name: string | null;
  walletAddress: string | null;
  role: Role;
}

// Google SVG icon
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [tab, setTab] = useState<Tab>(
    (searchParams.get("tab") as Tab) || "signup"
  );
  const [role, setRole] = useState<Role>("candidate");
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "" });
  const [formErrors, setFormErrors] = useState<Partial<FormState>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<SuccessData | null>(null);
  const [copied, setCopied] = useState(false);

  // Wallet adapter
  const { publicKey, signMessage, connected } = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();
  const [walletLoading, setWalletLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(
        user.role === "examiner" ? "/dashboard/examiner" : "/dashboard/candidate"
      );
    }
  }, [user, authLoading, router]);

  // Check for OAuth errors from server redirect
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "google_failed") setServerError("Google sign-in failed. Please try again.");
    if (error === "google_no_email") setServerError("Could not retrieve your Google email. Please try another method.");
  }, [searchParams]);

  // ── Validation ────────────────────────────────────────────────────────
  function validate(): boolean {
    const errors: Partial<FormState> = {};
    if (tab === "signup" && !form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Enter a valid email address";
    if (!form.password) errors.password = "Password is required";
    else if (tab === "signup" && form.password.length < 8)
      errors.password = "Password must be at least 8 characters";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // ── Email / Password submit ────────────────────────────────────────────
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setServerError(null);
    setLoading(true);

    try {
      const endpoint =
        tab === "signup" ? "/auth/email/signup" : "/auth/email/login";
      const body =
        tab === "signup"
          ? { name: form.name, email: form.email, password: form.password, role }
          : { email: form.email, password: form.password };

      const res = await fetch(`${SERVER_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Something went wrong");
        return;
      }

      if (tab === "signup") {
        if (data.role === "examiner") {
          // Examiners must pick a plan before entering the dashboard
          await refreshUser();
          router.push("/auth/plan");
        } else {
          setSuccess({
            name: data.name,
            walletAddress: data.walletAddress,
            role: data.role,
          });
        }
      } else {
        await refreshUser();
        router.push(
          data.role === "examiner" ? "/dashboard/examiner" : "/dashboard/candidate"
        );
      }
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  // ── Google OAuth ───────────────────────────────────────────────────────
  function handleGoogleClick() {
    // Redirect server-side — role passed as state param
    window.location.href = `${SERVER_URL}/auth/google?role=${role}`;
  }

  // ── Wallet login ───────────────────────────────────────────────────────
  async function handleWalletLogin() {
    if (!connected || !publicKey || !signMessage) {
      openWalletModal(true);
      return;
    }

    setWalletLoading(true);
    setServerError(null);

    try {
      const message = `Sign this message to authenticate with Cortix.\nTimestamp: ${Date.now()}`;
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(messageBytes);
      const signatureBase64 = Buffer.from(signatureBytes).toString("base64");

      const res = await fetch(`${SERVER_URL}/auth/wallet/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          signature: signatureBase64,
          message,
          role: tab === "signup" ? role : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Wallet authentication failed");
        return;
      }

      await refreshUser();
      if (data.role === "examiner") {
        router.push("/auth/plan");
      } else {
        router.push("/dashboard/candidate");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("rejected")) {
        setServerError("Signature request was rejected.");
      } else {
        setServerError("Wallet sign-in failed. Please try again.");
      }
    } finally {
      setWalletLoading(false);
    }
  }

  // ── Copy wallet address ────────────────────────────────────────────────
  function copyWalletAddress() {
    if (!success?.walletAddress) return;
    navigator.clipboard.writeText(success.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Continue after success (candidate only) ──────────────────────────
  async function handleContinue() {
    await refreshUser();
    router.push("/dashboard/candidate");
  }

  if (authLoading) {
    return (
      <div className="auth-root">
        <Loader2 size={32} className="spin-sm" style={{ color: "#7c3aed" }} />
      </div>
    );
  }

  return (
    <div className="auth-root">
      <div className="auth-orb-1" />
      <div className="auth-orb-2" />
      <div className="auth-grid" />

      <div className="auth-card">
        {/* Logo */}
        <a href="/" className="auth-logo">
          <div className="auth-logo-icon" />
          <div>
            <div className="auth-logo-text">Cortix</div>
            <div className="auth-logo-sub">Proof of Intelligence</div>
          </div>
        </a>

        {/* ── Success State ─────────────────────────────────────────── */}
        {success ? (
          <div className="auth-success">
            <div className="auth-success-icon">
              <Check size={24} />
            </div>
            <h2>Welcome, {success.name?.split(" ")[0] || "there"}! 🎉</h2>
            <p>Your Cortix account has been created with a secure managed wallet.</p>

            {success.walletAddress && (
              <div
                className="wallet-address-pill"
                onClick={copyWalletAddress}
                title="Click to copy"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {`${success.walletAddress.slice(0, 6)}...${success.walletAddress.slice(-6)}`}
              </div>
            )}

            <p style={{ fontSize: "0.78rem", color: "#52525b", marginBottom: "1.5rem" }}>
              Your private key is encrypted and stored securely. You'll never need a seed phrase.
            </p>

            <button className="btn-auth-submit" onClick={handleContinue}>
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* ── Tabs ──────────────────────────────────────────────── */}
            <div className="auth-tabs">
              <button
                id="tab-signup"
                className={`auth-tab ${tab === "signup" ? "active" : ""}`}
                onClick={() => { setTab("signup"); setServerError(null); setFormErrors({}); }}
              >
                Create Account
              </button>
              <button
                id="tab-login"
                className={`auth-tab ${tab === "login" ? "active" : ""}`}
                onClick={() => { setTab("login"); setServerError(null); setFormErrors({}); }}
              >
                Sign In
              </button>
            </div>

            {/* ── Heading ───────────────────────────────────────────── */}
            <h1 className="auth-heading">
              {tab === "signup" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="auth-subheading">
              {tab === "signup"
                ? "Join Cortix — your wallet is created automatically."
                : "Sign in to continue to your dashboard."}
            </p>

            {/* ── Role selector (signup only) ───────────────────────── */}
            {tab === "signup" && (
              <>
                <p className="role-label">I am a...</p>
                <div className="role-cards">
                  <button
                    id="role-examiner"
                    className={`role-card ${role === "examiner" ? "selected" : ""}`}
                    onClick={() => setRole("examiner")}
                  >
                    <div className="role-card-icon">🎓</div>
                    <div className="role-card-title">Examiner</div>
                    <div className="role-card-desc">Create & manage exams</div>
                  </button>
                  <button
                    id="role-candidate"
                    className={`role-card ${role === "candidate" ? "selected" : ""}`}
                    onClick={() => setRole("candidate")}
                  >
                    <div className="role-card-icon">📝</div>
                    <div className="role-card-title">Candidate</div>
                    <div className="role-card-desc">Take oral exams</div>
                  </button>
                </div>
              </>
            )}

            {/* ── Error banner ──────────────────────────────────────── */}
            {serverError && (
              <div className="auth-error-banner">
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                {serverError}
              </div>
            )}

            {/* ── Google button ─────────────────────────────────────── */}
            <button
              id="btn-google"
              className="btn-google"
              onClick={handleGoogleClick}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* ── Wallet connect button ─────────────────────────────── */}
            <button
              id="btn-wallet"
              className="btn-wallet-connect"
              style={{ marginTop: "0.625rem" }}
              onClick={handleWalletLogin}
              disabled={walletLoading}
            >
              {walletLoading ? (
                <Loader2 size={16} className="spin-sm" />
              ) : (
                <Wallet size={16} />
              )}
              {connected
                ? walletLoading
                  ? "Signing..."
                  : `Connect with ${publicKey?.toBase58().slice(0, 6)}…`
                : "Connect External Wallet"}
            </button>

            {/* ── Divider ───────────────────────────────────────────── */}
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or continue with email</span>
              <div className="auth-divider-line" />
            </div>

            {/* ── Email form ────────────────────────────────────────── */}
            <form onSubmit={handleEmailSubmit} noValidate>
              {tab === "signup" && (
                <div className="form-group">
                  <label htmlFor="input-name" className="form-label">Full Name</label>
                  <input
                    id="input-name"
                    type="text"
                    className={`form-input ${formErrors.name ? "error" : ""}`}
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoComplete="name"
                  />
                  {formErrors.name && (
                    <p className="form-error">{formErrors.name}</p>
                  )}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="input-email" className="form-label">Email Address</label>
                <input
                  id="input-email"
                  type="email"
                  className={`form-input ${formErrors.email ? "error" : ""}`}
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                />
                {formErrors.email && (
                  <p className="form-error">{formErrors.email}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="input-password" className="form-label">Password</label>
                <input
                  id="input-password"
                  type="password"
                  className={`form-input ${formErrors.password ? "error" : ""}`}
                  placeholder={tab === "signup" ? "Min. 8 characters" : "Your password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete={tab === "signup" ? "new-password" : "current-password"}
                />
                {formErrors.password && (
                  <p className="form-error">{formErrors.password}</p>
                )}
              </div>

              <button
                id="btn-email-submit"
                type="submit"
                className="btn-auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="spin-sm" />
                    {tab === "signup" ? "Creating Account..." : "Signing In..."}
                  </>
                ) : tab === "signup" ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="auth-footer-note">
              {tab === "signup" ? (
                <>
                  Already have an account?{" "}
                  <a href="#" onClick={(e) => { e.preventDefault(); setTab("login"); }}>
                    Sign in
                  </a>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <a href="#" onClick={(e) => { e.preventDefault(); setTab("signup"); }}>
                    Create one
                  </a>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader2 size={32} style={{ color: "#7c3aed", animation: "spin 0.7s linear infinite" }} />
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
