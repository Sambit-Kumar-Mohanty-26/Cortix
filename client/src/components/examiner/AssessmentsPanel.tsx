"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Clock, ToggleLeft, ToggleRight, Trash2, Loader2, BookOpen, Search } from "lucide-react";
import { Quiz } from "@/app/dashboard/examiner/page";
import CreateModal from "./CreateModal";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";
const EASE = [0.16, 1, 0.3, 1] as const;
type Filter = "All" | "Active" | "Inactive";

interface Props { quizzes: Quiz[]; loading: boolean; onRefresh: () => void; walletAddress: string; defaultFilter?: Filter; }

const DIFF: Record<string, string> = {
  easy:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  medium: "bg-amber-500/15   text-amber-400   border-amber-500/25",
  hard:   "bg-red-500/15     text-red-400     border-red-500/25",
};

export default function AssessmentsPanel({ quizzes, loading, onRefresh, walletAddress, defaultFilter = "All" }: Props) {
  const [filter, setFilter]       = useState<Filter>(defaultFilter);
  const [search, setSearch]       = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"toggle" | "delete" | null>(null);

  const filtered = quizzes.filter(q => {
    const ms = q.title.toLowerCase().includes(search.toLowerCase());
    const mf = filter === "All" ? true : filter === "Active" ? !!q.isActive : !q.isActive;
    return ms && mf;
  });

  async function toggle(quiz: Quiz) {
    setLoadingId(quiz.id); setActionType("toggle");
    try {
      await fetch(`${SERVER_URL}/quizzes/${quiz.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ isActive: !quiz.isActive }) });
      onRefresh();
    } finally { setLoadingId(null); setActionType(null); }
  }

  async function remove(id: number) {
    if (!confirm("Delete this assessment permanently?")) return;
    setLoadingId(id); setActionType("delete");
    try {
      await fetch(`${SERVER_URL}/quizzes/${id}`, { method: "DELETE", credentials: "include" });
      onRefresh();
    } finally { setLoadingId(null); setActionType(null); }
  }

  return (
    <div className="space-y-5 max-w-6xl pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Assessments</h1>
          <p className="text-zinc-500 text-sm">{quizzes.length} total · {quizzes.filter(q => q.isActive).length} active</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-purple px-5 py-2.5 rounded-full text-sm shrink-0">
          <Plus className="w-4 h-4" /> Create Assessment
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-1 glass rounded-xl p-1 self-start">
          {(["All", "Active", "Inactive"] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" : "text-zinc-500 hover:text-zinc-300"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="w-full pl-8 pr-4 py-2 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition-all" />
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-zinc-700">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /><span className="text-sm">Loading...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-2xl">
          <BookOpen className="w-12 h-12 text-zinc-800 mb-3" />
          <p className="text-zinc-500 font-semibold text-sm">No assessments found</p>
          <p className="text-zinc-700 text-xs mt-1">Try a different filter or create one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((quiz, i) => (
            <motion.div key={quiz.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
              className="glass-hover rounded-2xl p-5 relative overflow-hidden group">

              {/* Active stripe */}
              <div className={`absolute top-0 inset-x-0 h-0.5 ${quiz.isActive ? "bg-gradient-to-r from-violet-500 to-purple-500" : "bg-white/[0.06]"}`} />

              <div className="flex items-start justify-between gap-3 mb-4 mt-1">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-violet-400" />
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${quiz.isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-800/60 text-zinc-500"}`}>
                  {quiz.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{quiz.title}</h3>
              {quiz.description && <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{quiz.description}</p>}

              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${DIFF[quiz.difficulty || "medium"]}`}>
                  {quiz.difficulty || "medium"}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-zinc-600">
                  <Clock className="w-3 h-3" />
                  {quiz.timeLimitSeconds ? `${Math.floor(quiz.timeLimitSeconds / 60)} min` : "3 min"}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/[0.05]">
                <button onClick={() => toggle(quiz)} disabled={loadingId === quiz.id}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-zinc-400 hover:text-violet-300 glass hover:bg-violet-500/10 rounded-xl transition-all disabled:opacity-50">
                  {loadingId === quiz.id && actionType === "toggle" ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : quiz.isActive ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  {quiz.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => remove(quiz.id)} disabled={loadingId === quiz.id}
                  className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-red-400 glass hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50">
                  {loadingId === quiz.id && actionType === "delete" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCreate && (
          <CreateModal walletAddress={walletAddress} onClose={() => setShowCreate(false)}
            onCreated={() => { setShowCreate(false); onRefresh(); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
