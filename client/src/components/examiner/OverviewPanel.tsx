"use client";

import { motion } from "framer-motion";
import { Plus, FileText, Users, TrendingUp, CheckCircle, Clock, ArrowRight, Activity } from "lucide-react";
import { AuthUser } from "@/context/AuthContext";
import { Quiz } from "@/app/dashboard/examiner/page";

interface Props { user: AuthUser; quizzes: Quiz[]; loading: boolean; onNavigate: (s: string) => void; }

const EASE = [0.16, 1, 0.3, 1] as const;

export default function OverviewPanel({ user, quizzes, loading, onNavigate }: Props) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const firstName = user.name?.split(" ")[0] || "Examiner";
  const activeCount = quizzes.filter(q => q.isActive).length;

  const STATS = [
    { label: "Total Assessments", value: loading ? "—" : String(quizzes.length), icon: FileText,    color: "text-violet-400", glow: "border-violet-500/20 hover:border-violet-500/40" },
    { label: "Active Now",        value: loading ? "—" : String(activeCount),    icon: CheckCircle, color: "text-emerald-400", glow: "border-emerald-500/20 hover:border-emerald-500/40" },
    { label: "Candidates",        value: "—", icon: Users,      color: "text-blue-400",   glow: "border-blue-500/20 hover:border-blue-500/40" },
    { label: "Pass Rate",         value: "—", icon: TrendingUp, color: "text-amber-400",  glow: "border-amber-500/20 hover:border-amber-500/40" },
  ];

  const diffColor: Record<string, string> = {
    easy:   "bg-emerald-500/15 text-emerald-400",
    medium: "bg-amber-500/15   text-amber-400",
    hard:   "bg-red-500/15     text-red-400",
  };

  return (
    <div className="space-y-6 max-w-6xl pb-10">

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <p className="text-xs text-zinc-600 font-semibold uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{greeting}, {firstName} 👋</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {quizzes.length === 0 ? "Create your first assessment to get started." : `${activeCount} active assessment${activeCount !== 1 ? "s" : ""} running.`}
          </p>
        </div>
        <button onClick={() => onNavigate("assessments")} className="btn-purple px-5 py-2.5 rounded-full text-sm shrink-0">
          <Plus className="w-4 h-4" /> Create Assessment
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 + i * 0.07, ease: EASE }}
              className={`glass-hover rounded-2xl p-5 border ${s.glow} transition-all`}
            >
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center mb-3">
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-white mb-0.5">{s.value}</p>
              <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wide">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent assessments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38, ease: EASE }}
          className="lg:col-span-2 glass rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-bold text-white">Recent Assessments</h2>
            <button onClick={() => onNavigate("assessments")} className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-14 text-zinc-700 text-sm">Loading...</div>
          ) : quizzes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <FileText className="w-10 h-10 text-zinc-800 mb-3" />
              <p className="text-zinc-500 text-sm font-semibold">No assessments yet</p>
              <p className="text-zinc-700 text-xs mt-1">Create your first assessment to get started</p>
            </div>
          ) : (
            <div>
              {quizzes.slice(0, 5).map((quiz, i) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors border-b border-white/[0.04] last:border-0"
                >
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{quiz.title}</p>
                    <p className="text-[11px] text-zinc-600 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {quiz.timeLimitSeconds ? `${Math.floor(quiz.timeLimitSeconds / 60)} min` : "—"}
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${diffColor[quiz.difficulty || "medium"]}`}>
                        {quiz.difficulty || "medium"}
                      </span>
                    </p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${quiz.isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-800/60 text-zinc-500"}`}>
                    {quiz.isActive ? "Active" : "Inactive"}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.46, ease: EASE }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
            <Activity className="w-3.5 h-3.5 text-violet-400" />
            <h2 className="text-sm font-bold text-white">Activity</h2>
          </div>
          {[
            { text: "Dashboard ready",       sub: "Session started",          dot: "bg-violet-500" },
            { text: "Cortix initialised",    sub: "All systems operational",   dot: "bg-emerald-500" },
            { text: "Connected to Solana",   sub: "devnet · RPC active",       dot: "bg-cyan-500" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors border-b border-white/[0.04] last:border-0">
              <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${item.dot}`} />
              <div>
                <p className="text-xs font-semibold text-zinc-300">{item.text}</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
