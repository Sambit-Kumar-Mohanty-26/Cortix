"use client";

import { motion } from "framer-motion";
import { Mic2, ShieldCheck, Brain, Award, BarChart3, Wallet } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const features = [
  {
    icon: Mic2,
    title: "AI Oral Examiner",
    desc: "Dynamic viva questions grounded in your uploaded content. The AI listens, follows up, and adapts in real time.",
    accent: "violet",
  },
  {
    icon: ShieldCheck,
    title: "Real-Time Proctoring",
    desc: "Detect suspicious behavior continuously — eye gaze, tab switches, full-screen enforcement, ambient voice monitoring.",
    accent: "blue",
  },
  {
    icon: Brain,
    title: "Instant AI Grading",
    desc: "Evaluate conceptual depth, critical reasoning, and communication clarity within seconds of exam completion.",
    accent: "indigo",
  },
  {
    icon: Award,
    title: "Solana Certificates",
    desc: "Soulbound non-transferable NFTs with immutable metadata — permanent, portable, and publicly verifiable on-chain.",
    accent: "teal",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Review full transcripts, session recordings, integrity flags, and score breakdowns. Every exam fully auditable.",
    accent: "cyan",
  },
  {
    icon: Wallet,
    title: "Wallet Authentication",
    desc: "Secure, passwordless identity via Phantom, Solflare, and other Solana wallets. No account required.",
    accent: "purple",
  },
];

const accentMap: Record<string, { bg: string; border: string; icon: string; glow: string }> = {
  violet: { bg: "from-violet-600/15", border: "border-violet-500/20", icon: "text-violet-400", glow: "group-hover:shadow-[0_0_40px_rgba(139,92,246,0.1)]" },
  blue:   { bg: "from-blue-600/15",   border: "border-blue-500/20",   icon: "text-blue-400",   glow: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.1)]" },
  indigo: { bg: "from-indigo-600/15", border: "border-indigo-500/20", icon: "text-indigo-400", glow: "group-hover:shadow-[0_0_40px_rgba(99,102,241,0.1)]" },
  teal:   { bg: "from-teal-600/15",   border: "border-teal-500/20",   icon: "text-teal-400",   glow: "group-hover:shadow-[0_0_40px_rgba(20,184,166,0.1)]" },
  cyan:   { bg: "from-cyan-600/15",   border: "border-cyan-500/20",   icon: "text-cyan-400",   glow: "group-hover:shadow-[0_0_40px_rgba(34,211,238,0.1)]" },
  purple: { bg: "from-purple-600/15", border: "border-purple-500/20", icon: "text-purple-400", glow: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]" },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative section-py overflow-hidden">
      <div className="aurora-orb w-[500px] h-[500px] bg-violet-700/12 top-0 left-1/4" style={{ animationDelay: "-2s" }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-medium text-zinc-600 tracking-[0.22em] uppercase mb-5"
          >
            Features
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6"
          >
            Everything You Need to{" "}
            <span className="text-gradient-cyan">Verify Intelligence</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 text-lg max-w-xl mx-auto"
          >
            A complete assessment platform — from AI-driven oral exams to permanent blockchain credentials.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            const a = accentMap[f.accent];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
                className={`glass-hover rounded-2xl p-7 ${a.border} ${a.glow} group relative overflow-hidden transition-all duration-400`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${a.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none`} />
                <div className={`w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-5 w-5 ${a.icon}`} />
                </div>
                <h3 className="text-[17px] font-semibold text-white mb-2.5">{f.title}</h3>
                <p className="text-zinc-400 text-[14px] leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
