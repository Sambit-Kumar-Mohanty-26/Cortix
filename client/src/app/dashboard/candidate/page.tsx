"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, LogOut, Copy, ExternalLink,
  Loader2, User, Wallet, Shield, Clock, Star
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "../dashboard.css";
import "./candidate.css";

export default function CandidateDashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  // Auth guard
  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/auth"); return; }
    if (user.role !== "candidate") { router.replace("/dashboard/examiner"); return; }
  }, [user, authLoading, router]);

  function copyWallet() {
    if (!user?.walletAddress) return;
    navigator.clipboard.writeText(user.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function openExplorer() {
    if (!user?.walletAddress) return;
    window.open(
      `https://explorer.solana.com/address/${user.walletAddress}?cluster=devnet`,
      "_blank"
    );
  }

  if (authLoading || !user) {
    return (
      <div className="dashboard-container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <Loader2 size={36} className="spin" style={{ color: "#7c3aed" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <BookOpen size={26} />
            <div>
              <h1>Candidate Dashboard</h1>
              <span style={{ fontSize: "0.78rem", color: "#71717a", fontWeight: 400 }}>
                Welcome, {user.name?.split(" ")[0] || "Candidate"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.4rem 0.75rem",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "999px",
                color: "#a1a1aa",
                fontSize: "0.75rem",
              }}
            >
              <User size={12} />
              {user.email || user.walletAddress?.slice(0, 8) + "…"}
            </div>

            <button
              onClick={logout}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.4rem 0.75rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "999px",
                color: "#71717a",
                fontSize: "0.78rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="candidate-main">
        {/* Wallet card */}
        <div className="candidate-wallet-card">
          <div className="cwc-top">
            <div className="cwc-icon">
              <Wallet size={22} />
            </div>
            <div className="cwc-badge">
              {user.walletType === "managed" ? "🔒 Managed Wallet" : "🔗 External Wallet"}
            </div>
          </div>

          <p className="cwc-label">Your Solana Wallet Address</p>
          <p className="cwc-address">
            {user.walletAddress
              ? `${user.walletAddress.slice(0, 12)}...${user.walletAddress.slice(-8)}`
              : "No wallet linked"}
          </p>

          <div className="cwc-actions">
            <button className="cwc-btn" onClick={copyWallet}>
              {copied ? <Star size={13} style={{ color: "#4ade80" }} /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy Address"}
            </button>
            {user.walletAddress && (
              <button className="cwc-btn" onClick={openExplorer}>
                <ExternalLink size={13} />
                View on Explorer
              </button>
            )}
          </div>

          {user.walletType === "managed" && (
            <p className="cwc-note">
              <Shield size={12} style={{ display: "inline", marginRight: 4 }} />
              Your private key is encrypted and managed securely by Cortix. No seed phrase required.
            </p>
          )}
        </div>

        {/* Stats row */}
        <div className="candidate-stats">
          <div className="cstat-card">
            <div className="cstat-icon"><BookOpen size={18} /></div>
            <div className="cstat-value">0</div>
            <div className="cstat-label">Exams Taken</div>
          </div>
          <div className="cstat-card">
            <div className="cstat-icon"><Star size={18} /></div>
            <div className="cstat-value">—</div>
            <div className="cstat-label">Avg. Score</div>
          </div>
          <div className="cstat-card">
            <div className="cstat-icon"><Shield size={18} /></div>
            <div className="cstat-value">0</div>
            <div className="cstat-label">Certificates</div>
          </div>
          <div className="cstat-card">
            <div className="cstat-icon"><Clock size={18} /></div>
            <div className="cstat-value">0</div>
            <div className="cstat-label">Hours Assessed</div>
          </div>
        </div>

        {/* Available exams placeholder */}
        <div className="candidate-section">
          <h2 className="candidate-section-title">Available Exams</h2>
          <div className="candidate-empty">
            <div className="candidate-empty-icon">
              <BookOpen size={32} />
            </div>
            <h3>No exams available yet</h3>
            <p>
              Exams assigned to you will appear here. Share your wallet address{" "}
              <strong style={{ color: "#c4b5fd" }}>
                {user.walletAddress
                  ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
                  : ""}
              </strong>{" "}
              with an examiner to get started.
            </p>
          </div>
        </div>

        {/* Certificates placeholder */}
        <div className="candidate-section">
          <h2 className="candidate-section-title">My Certificates</h2>
          <div className="candidate-empty">
            <div className="candidate-empty-icon">
              <Shield size={32} />
            </div>
            <h3>No certificates yet</h3>
            <p>
              After passing an oral exam, your certificate NFT will be minted to your
              wallet and displayed here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
