"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, Copy, ExternalLink, Check, ArrowLeft, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "./wallet.css";

export default function WalletSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

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

  if (loading || !user) {
    return (
      <div className="wallet-settings-root">
        <div className="ws-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="wallet-settings-root">
      <div className="ws-container">
        <button className="ws-back-btn" onClick={() => router.back()}>
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="ws-header">
          <div className="ws-header-icon">
            <Wallet size={24} />
          </div>
          <div>
            <h1 className="ws-title">Wallet Settings</h1>
            <p className="ws-subtitle">Manage your Solana wallet linked to Cortix</p>
          </div>
        </div>

        <div className="ws-card">
          {/* Status row */}
          <div className="ws-row">
            <span className="ws-row-label">Status</span>
            <span className="ws-status-badge">
              <span className="ws-status-dot" />
              Active
            </span>
          </div>

          {/* Wallet type */}
          <div className="ws-row">
            <span className="ws-row-label">Wallet Type</span>
            <span className="ws-type-badge">
              {user.walletType === "managed" ? (
                <>
                  <Shield size={12} />
                  Managed Wallet
                </>
              ) : (
                <>
                  <Wallet size={12} />
                  External Wallet
                </>
              )}
            </span>
          </div>

          {/* Network */}
          <div className="ws-row">
            <span className="ws-row-label">Network</span>
            <span className="ws-value">Solana Devnet</span>
          </div>

          {/* Auth provider */}
          <div className="ws-row">
            <span className="ws-row-label">Linked Via</span>
            <span className="ws-value" style={{ textTransform: "capitalize" }}>
              {user.authProvider}
            </span>
          </div>

          <div className="ws-divider" />

          {/* Address */}
          <p className="ws-address-label">Wallet Address</p>
          <div className="ws-address-box">
            <span className="ws-address-text">{user.walletAddress || "No wallet linked"}</span>
          </div>

          <div className="ws-actions">
            <button className="ws-action-btn" onClick={copyWallet}>
              {copied ? <Check size={14} style={{ color: "#4ade80" }} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy Address"}
            </button>
            {user.walletAddress && (
              <button className="ws-action-btn" onClick={openExplorer}>
                <ExternalLink size={14} />
                View on Explorer
              </button>
            )}
          </div>

          {user.walletType === "managed" && (
            <div className="ws-managed-notice">
              <Shield size={14} />
              <div>
                <strong>Managed by Cortix</strong>
                <p>
                  Your private key is encrypted with AES-256-GCM and stored
                  securely. You never need to manage a seed phrase. NFT
                  certificates will be minted to this address automatically
                  when you pass an exam.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
