"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Loader2 } from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";
const FIELD = "w-full px-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.10] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-all";
const LABEL = "block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5";

interface Props { walletAddress: string; onClose: () => void; onCreated: () => void; }

export default function CreateModal({ walletAddress, onClose, onCreated }: Props) {
  const [form, setForm] = useState({ title: "", description: "", contextMaterial: "", difficulty: "medium", timeLimitSeconds: 180 });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setError(null);
    try {
      const res = await fetch(`${SERVER_URL}/quizzes`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ ...form, creatorWallet: walletAddress }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to create"); }
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.22 }}
        className="relative w-full max-w-lg glass rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.15)]"
      >
        {/* Top gradient border */}
        <div className="h-px bg-gradient-to-r from-violet-500/60 via-purple-500/40 to-transparent" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-bold text-white">Create Assessment</h2>
            <p className="text-[11px] text-zinc-600 mt-0.5">AI oral exam grounded in your content</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[72vh] overflow-y-auto">
          {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl text-sm text-red-400">{error}</div>}

          <div><label className={LABEL}>Title *</label>
            <input required value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g., Blockchain Fundamentals" className={FIELD} /></div>

          <div><label className={LABEL}>Description</label>
            <input value={form.description} onChange={e => set("description", e.target.value)} placeholder="Brief overview" className={FIELD} /></div>

          <div><label className={LABEL}>Knowledge Base *</label>
            <textarea required rows={5} value={form.contextMaterial} onChange={e => set("contextMaterial", e.target.value)}
              placeholder="Paste the material the AI will study to generate oral exam questions..."
              className={`${FIELD} resize-none`} />
            <p className="text-[11px] text-zinc-700 mt-1.5">The AI oral examiner will ask questions based on this content.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className={LABEL}>Difficulty</label>
              <select value={form.difficulty} onChange={e => set("difficulty", e.target.value)} className={FIELD}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div><label className={LABEL}>Time (seconds)</label>
              <input type="number" min={60} max={3600} value={form.timeLimitSeconds}
                onChange={e => set("timeLimitSeconds", parseInt(e.target.value) || 180)} className={FIELD} />
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="btn-purple w-full py-3 rounded-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2">
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Plus className="w-4 h-4" /> Create Assessment</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
