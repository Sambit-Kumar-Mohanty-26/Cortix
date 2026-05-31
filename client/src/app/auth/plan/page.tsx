"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, AlertCircle, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "./plan.css";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

// Razorpay is loaded via script tag — declare global type
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}
interface RazorpayInstance {
  open(): void;
}
interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const FEATURES = {
  free: [
    "Up to 5 active exams",
    "Up to 20 candidates per exam",
    "Basic proctoring",
    "Standard support",
  ],
  pro: [
    "Unlimited active exams",
    "Unlimited candidates",
    "Advanced AI proctoring",
    "NFT certificate minting",
    "Priority support",
    "Full analytics dashboard",
  ],
};

type Step = "select" | "processing" | "success";

export default function PlanSelectorPage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("select");
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">("free");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paidPlan, setPaidPlan] = useState<"free" | "pro">("free");

  // Guard: redirect non-examiners or already-planned users
  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/auth"); return; }
    if (user.role !== "examiner") { router.replace("/dashboard/candidate"); return; }
    // If already has an active plan, skip straight to dashboard
    if (user.plan && user.planStatus === "active") {
      router.replace("/dashboard/examiner");
    }
  }, [user, authLoading, router]);

  // Load Razorpay checkout.js script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // ── Select Free Plan ─────────────────────────────────────────────────
  const handleSelectFree = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/payment/select-free`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to select free plan");
      }
      setPaidPlan("free");
      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Initiate Razorpay for Pro Plan ───────────────────────────────────
  const handleSelectPro = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      // 1. Create Razorpay order on server
      const orderRes = await fetch(`${SERVER_URL}/payment/create-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!orderRes.ok) {
        const d = await orderRes.json();
        throw new Error(d.error || "Failed to create payment order");
      }
      const order = await orderRes.json();

      // 2. Open Razorpay checkout
      if (typeof window.Razorpay === "undefined") {
        throw new Error("Payment system failed to load. Please refresh and try again.");
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Cortix",
        description: "Pro Plan — Unlimited AI Oral Exams",
        order_id: order.orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#7c3aed" },
        handler: async (response: RazorpayPaymentResponse) => {
          setStep("processing");

          // 3. Verify payment on server
          try {
            const verifyRes = await fetch(`${SERVER_URL}/payment/verify`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed");
            }
            setPaidPlan("pro");
            setStep("success");
          } catch (verifyErr: unknown) {
            setError(
              verifyErr instanceof Error
                ? verifyErr.message
                : "Payment verification failed. Contact support."
            );
            setStep("select");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      });

      rzp.open();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment initiation failed");
      setLoading(false);
    }
    // Don't setLoading(false) here — Razorpay modal handles dismiss
  }, [user]);

  const handleContinue = async () => {
    await refreshUser();
    router.push("/dashboard/examiner");
  };

  if (authLoading || !user) {
    return (
      <div className="plan-root">
        <Loader2 size={36} className="spin-sm" style={{ color: "#7c3aed" }} />
      </div>
    );
  }

  return (
    <div className="plan-root">
      <div className="plan-orb-1" />
      <div className="plan-orb-2" />
      <div className="plan-grid" />

      <div className="plan-container">
        {/* Logo */}
        <a href="/" className="plan-logo">
          <div className="plan-logo-icon" />
          <div>
            <div className="plan-logo-text">Cortix</div>
            <div className="plan-logo-sub">Proof of Intelligence</div>
          </div>
        </a>

        {/* ── Processing state ────────────────────────────────────── */}
        {step === "processing" && (
          <div className="plan-processing">
            <div className="plan-processing-icon">
              <Loader2 size={28} className="spin-sm" />
            </div>
            <h2>Verifying Payment...</h2>
            <p>Please wait while we confirm your payment with Razorpay.</p>
          </div>
        )}

        {/* ── Success state ───────────────────────────────────────── */}
        {step === "success" && (
          <div className="plan-success">
            <div className="plan-success-icon">
              <Check size={28} />
            </div>
            <h2>
              {paidPlan === "pro"
                ? "Pro Plan Activated! 🎉"
                : "You're all set! 👋"}
            </h2>
            <p>
              {paidPlan === "pro"
                ? "Your Pro plan is active. Enjoy unlimited exams, advanced proctoring, and NFT certificates."
                : "You're on the Free plan. You can upgrade anytime from your dashboard."}
            </p>
            <button className="plan-continue-btn" onClick={handleContinue}>
              Continue to Dashboard
              <Zap size={16} />
            </button>
          </div>
        )}

        {/* ── Plan selection ──────────────────────────────────────── */}
        {step === "select" && (
          <>
            <p className="plan-step-indicator">Step 2 of 2 — Choose Your Plan</p>
            <h1 className="plan-heading">
              Pick the plan that&apos;s right for you
            </h1>
            <p className="plan-sub">
              Start for free, upgrade anytime. No contracts.
            </p>

            {error && (
              <div className="plan-error">
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                {error}
              </div>
            )}

            <div className="plan-cards">
              {/* Free Card */}
              <div
                className={`plan-card ${selectedPlan === "free" ? "selected" : ""}`}
                onClick={() => setSelectedPlan("free")}
                id="plan-card-free"
              >
                <div className="plan-card-top">
                  <div className="plan-card-name">Free</div>
                  <div className="plan-check-ring">
                    {selectedPlan === "free" && <Check size={12} color="#fff" />}
                  </div>
                </div>

                <div className="plan-price-row">
                  <span className="plan-free-label">$0</span>
                  <span className="plan-period">&nbsp;/ month</span>
                </div>

                <ul className="plan-features">
                  {FEATURES.free.map((f) => (
                    <li key={f} className="plan-feature-item">
                      <span className="plan-feature-check"><Check size={10} /></span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  id="btn-select-free"
                  className="plan-card-btn free-btn"
                  onClick={(e) => { e.stopPropagation(); handleSelectFree(); }}
                  disabled={loading}
                >
                  {loading && selectedPlan === "free" ? (
                    <><Loader2 size={14} className="spin-sm" /> Setting up...</>
                  ) : "Get Started Free"}
                </button>
              </div>

              {/* Pro Card */}
              <div
                className={`plan-card pro-card ${selectedPlan === "pro" ? "selected" : ""}`}
                onClick={() => setSelectedPlan("pro")}
                id="plan-card-pro"
              >
                <div className="plan-popular-badge">Most Popular</div>

                <div className="plan-card-top">
                  <div className="plan-card-name">Pro</div>
                  <div className="plan-check-ring">
                    {selectedPlan === "pro" && <Check size={12} color="#fff" />}
                  </div>
                </div>

                <div className="plan-price-row">
                  <span className="plan-currency">$</span>
                  <span className="plan-amount">49</span>
                  <span className="plan-period">/ month</span>
                </div>

                <ul className="plan-features">
                  {FEATURES.pro.map((f) => (
                    <li key={f} className="plan-feature-item">
                      <span className="plan-feature-check"><Check size={10} /></span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  id="btn-select-pro"
                  className="plan-card-btn pro-btn"
                  onClick={(e) => { e.stopPropagation(); handleSelectPro(); }}
                  disabled={loading}
                >
                  {loading && selectedPlan === "pro" ? (
                    <><Loader2 size={14} className="spin-sm" /> Opening payment...</>
                  ) : "Upgrade to Pro — $49/mo"}
                </button>
              </div>
            </div>

            <p className="plan-skip">
              Decide later?{" "}
              <a onClick={handleSelectFree}>Start with free plan for now</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
