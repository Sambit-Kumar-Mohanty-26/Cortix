"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/examiner/Sidebar";
import TopBar from "@/components/examiner/TopBar";
import OverviewPanel from "@/components/examiner/OverviewPanel";
import AssessmentsPanel from "@/components/examiner/AssessmentsPanel";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

export interface Quiz {
  id: number;
  title: string;
  description: string | null;
  difficulty: string | null;
  timeLimitSeconds: number | null;
  isActive: boolean | null;
  createdAt: string | null;
}

function ComingSoon({ section }: { section: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center text-3xl mb-6">🚧</div>
      <h2 className="text-xl font-bold text-white mb-2 capitalize">{section}</h2>
      <p className="text-zinc-500 text-sm">This module is coming soon.</p>
    </div>
  );
}

export default function ExaminerPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/auth"); return; }
    if (user.role !== "examiner") { router.replace("/dashboard/candidate"); return; }
  }, [user, authLoading, router]);

  const fetchQuizzes = useCallback(async () => {
    if (!user?.walletAddress) return;
    setLoadingQuizzes(true);
    try {
      const res = await fetch(`${SERVER_URL}/quizzes?wallet=${user.walletAddress}`, {
        credentials: "include",
      });
      if (res.ok) setQuizzes(await res.json());
    } catch (e) {
      console.error("Failed to fetch quizzes:", e);
    } finally {
      setLoadingQuizzes(false);
    }
  }, [user?.walletAddress]);

  useEffect(() => {
    if (user?.walletAddress) fetchQuizzes();
  }, [user?.walletAddress, fetchQuizzes]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewPanel user={user} quizzes={quizzes} loading={loadingQuizzes} onNavigate={setActiveSection} />;
      case "assessments":
      case "assessments-drafts":
      case "assessments-published":
        return (
          <AssessmentsPanel
            quizzes={quizzes}
            loading={loadingQuizzes}
            onRefresh={fetchQuizzes}
            walletAddress={user.walletAddress || ""}
            defaultFilter={
              activeSection === "assessments-drafts" ? "Inactive"
              : activeSection === "assessments-published" ? "Active"
              : "All"
            }
          />
        );
      default:
        return <ComingSoon section={activeSection} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} user={user} onLogout={logout} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <TopBar user={user} />
        <main className="flex-1 overflow-y-auto px-6 py-6">{renderContent()}</main>
      </div>
    </div>
  );
}
