"use client";

import { motion } from "framer-motion";
import { Eye, MonitorX, Maximize, Mic, Video, BarChart3 } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const features = [
  { icon: Eye,       title: "Eye Gaze Tracking",      desc: "Detects looking away from screen or at a secondary device in real time.", active: true },
  { icon: MonitorX,  title: "Tab Switch Detection",   desc: "Flags every navigation attempt outside the exam window instantly.", active: false },
  { icon: Maximize,  title: "Full-Screen Enforcement", desc: "Exit-fullscreen triggers an immediate integrity alert to the examiner.", active: true },
  { icon: Mic,       title: "Ambient Voice Monitoring", desc: "AI listens for additional voices or whispered prompts in the room.", active: false },
  { icon: Video,     title: "Session Recording",       desc: "Full video and audio session archived for post-exam audit review.", active: true },
  { icon: BarChart3, title: "Integrity Score",         desc: "Composite 0–100 score summarising all proctoring signals per session.", active: false },
];

export default function ProctoringSection() {
  return (
    <section id="proctoring" className="relative section-py overflow-hidden">
      <div className="aurora-orb w-[500px] h-[500px] bg-blue-700/12 top-1/4 -left-32" style={{ animationDelay: "-6s" }} />
      <div className="aurora-orb w-[400px] h-[400px] bg-violet-700/10 bottom-0 right-0"  style={{ animationDelay: "-2s" }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Simulated proctoring UI */}
          <motion.div
            initial={{ opacity: 0, x: -40, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative"
          >
            <div className="glass rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(59,130,246,0.15),0_40px_80px_rgba(0,0,0,0.8)]">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] bg-white/[0.02]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[11px] text-zinc-500">Live Proctoring Monitor</span>
                <span className="flex items-center gap-1 text-[11px] text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                  Active
                </span>
              </div>

              <div className="p-5 space-y-3">
                {/* Fake camera feed */}
                <div className="relative h-40 rounded-xl overflow-hidden bg-zinc-900 border border-white/[0.05]">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-grid opacity-40" />
                  {/* Gaze crosshair */}
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative w-10 h-10">
                      <div className="absolute inset-0 rounded-full border-2 border-green-400/60 animate-pulse" />
                      <div className="absolute inset-[30%] rounded-full bg-green-400/40" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] text-green-400 font-medium">Gaze: ON SCREEN ✓</span>
                  </div>
                  {/* Scan line */}
                  <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent animate-scanline" />
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Tab Switches", val: "0", ok: true },
                    { label: "Fullscreen",   val: "ON",  ok: true },
                    { label: "Voices",       val: "1",   ok: true },
                  ].map(({ label, val, ok }) => (
                    <div key={label} className="glass rounded-xl p-3 text-center border-white/[0.04]">
                      <div className={`text-lg font-bold ${ok ? "text-white" : "text-red-400"}`}>{val}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Integrity bar */}
                <div className="glass rounded-xl p-4 border-white/[0.04]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[12px] text-zinc-400">Session Integrity</span>
                    <span className="text-[13px] font-semibold text-green-400">96 / 100</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "96%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-5 -right-5 glass rounded-2xl px-5 py-3.5 border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]"
            >
              <p className="text-[12px] text-zinc-400">Zero violations detected</p>
              <p className="text-xl font-bold text-green-400">Clean Session ✓</p>
            </motion.div>
          </motion.div>

          {/* Right: Feature list */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[11px] font-medium text-zinc-600 tracking-[0.22em] uppercase mb-6"
            >
              Proctoring Showcase
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6"
            >
              Integrity you can{" "}
              <span className="text-gradient-cyan">see and prove.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 text-[16px] leading-relaxed mb-10"
            >
              Six independent signals run in parallel throughout every exam session,
              producing an auditable integrity record alongside the transcript.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                    className="flex items-start gap-3 glass rounded-xl p-4 border-white/[0.05]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-white">{f.title}</p>
                      <p className="text-[12px] text-zinc-500 leading-snug mt-0.5">{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
