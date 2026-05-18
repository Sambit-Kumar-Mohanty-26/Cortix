"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Play, Mic, Eye, ShieldCheck, Zap } from "lucide-react";

const WAVEFORM = Array.from({ length: 26 }, (_, i) =>
  `${Math.round(25 + Math.abs(Math.sin(i * 0.9) * 60))}%`
);

const stats = [
  { value: "95%",   label: "Reduction in AI cheating" },
  { value: "< 2m",  label: "Exam creation time" },
  { value: "< 30s", label: "Instant grading" },
  { value: "100%",  label: "On-chain credentials" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-32 bg-grid">
      {/* Aurora orbs */}
      <div className="aurora-orb w-[700px] h-[700px] bg-violet-700/25 -top-48 left-1/2 -translate-x-1/2" style={{ animationDelay: "0s" }} />
      <div className="aurora-orb w-[450px] h-[450px] bg-cyan-500/15 top-1/2 -right-40"                   style={{ animationDelay: "-5s" }} />
      <div className="aurora-orb w-[350px] h-[350px] bg-indigo-600/20 bottom-10 -left-24"                style={{ animationDelay: "-9s" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.08),transparent)] pointer-events-none" />

      <motion.div style={{ y: yText }} className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 text-center flex flex-col items-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mb-10"
        >
          <span className="inline-flex items-center gap-2.5 glass rounded-full px-4 py-2 text-[12.5px] font-medium text-zinc-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
            </span>
            <Sparkles className="h-3 w-3 text-violet-400" />
            The Future of Verifiable Assessment
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: EASE }}
          className="text-[68px] sm:text-[90px] lg:text-[112px] font-semibold tracking-[-0.04em] leading-[0.93] mb-8"
        >
          Prove Real
          <br />
          <span className="text-gradient-hero">Intelligence.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: EASE }}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-4"
        >
          AI-powered oral examinations with live proctoring, instant scoring,
          and tamper-proof blockchain certificates.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
          className="text-sm text-zinc-500 max-w-xl mx-auto leading-relaxed mb-12"
        >
          Cortix evaluates genuine understanding through real-time voice responses,
          monitors exam integrity using gaze tracking and tab-switch detection,
          and issues permanent Proof of Intelligence credentials on Solana.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.52, ease: EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <a href="#start" className="btn-white text-[15px] px-7 py-3.5 group shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            Start Creating Exams
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#demo" className="btn-outline text-[15px] px-7 py-3.5">
            <Play className="h-4 w-4 fill-current" />
            Watch Demo
          </a>
        </motion.div>

        {/* Trust */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="text-[10.5px] font-medium text-zinc-600 tracking-[0.2em] uppercase mb-7"
        >
          Trusted by universities, certification bodies, hiring teams &amp; Web3 communities
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.72, ease: EASE }}
          className="w-full grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden border border-white/[0.05] bg-white/[0.015] mb-20"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-6 py-7 text-left ${i < 3 ? "border-r border-white/[0.05]" : ""} ${i >= 2 ? "border-t md:border-t-0 border-white/[0.05]" : ""}`}
            >
              <div className="text-[28px] font-semibold tracking-tight text-white mb-1.5">{s.value}</div>
              <div className="text-xs text-zinc-500">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Product UI Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.9, ease: EASE }}
          className="w-full max-w-3xl animate-float"
        >
          <div className="rounded-2xl overflow-hidden bg-[#0d0d16] border border-violet-500/25 shadow-[0_0_0_1px_rgba(139,92,246,0.15),0_40px_80px_rgba(0,0,0,0.8),0_0_60px_rgba(139,92,246,0.12)]">
            {/* Title bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="text-[11px] text-zinc-400 font-medium tracking-wide">Cortix AI Examiner — Live Session</div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] text-red-400 font-semibold">REC</span>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* AI question */}
              <div className="space-y-3">
                <p className="text-[10px] text-violet-400/70 tracking-[0.18em] uppercase font-semibold">AI Examiner</p>
                <div className="rounded-xl p-4 bg-white/[0.06] border border-white/10">
                  <p className="text-[13px] text-zinc-100 leading-relaxed">
                    &ldquo;Explain how transformer attention mechanisms differ from traditional RNNs,
                    and why this matters for long-range dependencies.&rdquo;
                  </p>
                </div>
                {/* Waveform */}
                <div className="flex items-center gap-[3px] h-10 px-1 bg-white/[0.03] rounded-lg border border-white/[0.06] py-2">
                  <Mic className="h-4 w-4 text-violet-400 mx-2 flex-shrink-0" />
                  {WAVEFORM.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-violet-400 rounded-full opacity-80"
                      style={{ height: h }}
                    />
                  ))}
                </div>
                <p className="text-[12px] text-zinc-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                  Listening… student responding
                </p>
              </div>

              {/* Proctoring panel */}
              <div className="space-y-2">
                <p className="text-[10px] text-violet-400/70 tracking-[0.18em] uppercase font-semibold">Integrity Monitor</p>
                {[
                  { icon: Eye,         label: "Eye contact",       val: "✓ Maintained", ok: true },
                  { icon: ShieldCheck, label: "Tab switches",      val: "0 detected",   ok: true },
                  { icon: Mic,         label: "Background voices", val: "Clear",        ok: true },
                  { icon: Zap,         label: "Full screen",       val: "✓ Enforced",   ok: true },
                ].map(({ icon: Icon, label, val, ok }) => (
                  <div key={label} className="flex items-center justify-between rounded-lg px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="text-[12px] text-zinc-300">{label}</span>
                    </div>
                    <span className={`text-[12px] font-semibold ${ok ? "text-green-400" : "text-red-400"}`}>{val}</span>
                  </div>
                ))}
                <div className="rounded-xl p-4 bg-white/[0.05] border border-white/[0.08] mt-1">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[12px] text-zinc-300 font-medium">Integrity Score</span>
                    <span className="text-[13px] font-bold text-green-400">98 / 100</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
