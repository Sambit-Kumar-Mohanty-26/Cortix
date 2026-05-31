"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Copy, ExternalLink, Loader2, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import QuizForm from "@/components/dashboard/QuizForm";
import QuizTable from "@/components/dashboard/QuizTable";
import "../dashboard.css";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

interface Quiz {
  id: number;
  title: string;
  description: string | null;
  difficulty: string | null;
  timeLimitSeconds: number | null;
  isActive: boolean | null;
  createdAt: string | null;
}

export default function ExaminerDashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auth guard
  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/auth"); return; }
    if (user.role !== "examiner") { router.replace("/dashboard/candidate"); return; }
  }, [user, authLoading, router]);

  const fetchQuizzes = useCallback(async () => {
    if (!user?.walletAddress) return;
    setLoadingQuizzes(true);
    try {
      const response = await fetch(`${SERVER_URL}/quizzes?wallet=${user.walletAddress}`, {
        credentials: "include",
      });
      if (response.ok) {
        setQuizzes(await response.json());
      }
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    } finally {
      setLoadingQuizzes(false);
    }
  }, [user?.walletAddress]);

  useEffect(() => {
    if (user?.walletAddress) fetchQuizzes();
  }, [user?.walletAddress, fetchQuizzes]);

  function copyWallet() {
    if (!user?.walletAddress) return;
    navigator.clipboard.writeText(user.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <LayoutDashboard size={26} />
            <div>
              <h1>Examiner Dashboard</h1>
              <span style={{ fontSize: "0.78rem", color: "#71717a", fontWeight: 400 }}>
                Welcome back, {user.name?.split(" ")[0] || "Examiner"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Wallet pill */}
            {user.walletAddress && (
              <button
                onClick={copyWallet}
                title="Copy wallet address"
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.4rem 0.75rem",
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  borderRadius: "999px",
                  color: "#c4b5fd",
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {copied ? <Copy size={12} style={{ color: "#4ade80" }} /> : <Copy size={12} />}
                {`${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`}
              </button>
            )}

            {/* Profile badge */}
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

            {/* Logout */}
            <button
              onClick={logout}
              title="Sign out"
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

      <main className="dashboard-main">
        <section className="create-section">
          <QuizForm
            walletAddress={user.walletAddress || ""}
            onQuizCreated={fetchQuizzes}
          />
        </section>

        <section className="list-section">
          {loadingQuizzes ? (
            <div className="loading-state">
              <Loader2 size={32} className="spin" />
              <p>Loading your exams...</p>
            </div>
          ) : (
            <QuizTable quizzes={quizzes} onQuizUpdated={fetchQuizzes} />
          )}
        </section>
      </main>
    </div>
  );
}
