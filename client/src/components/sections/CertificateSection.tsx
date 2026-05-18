"use client";

import { motion } from "framer-motion";
import { Award, Hash, User, Star, Shield, FileText, Clock, CheckCircle2 } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const metadata = [
  { icon: FileText, label: "Exam Title",         value: "Advanced ML — Transformers" },
  { icon: User,     label: "Wallet Address",      value: "7xK3…mQ9r" },
  { icon: Star,     label: "Final Score",         value: "94 / 100" },
  { icon: Shield,   label: "Integrity Score",     value: "98 / 100" },
  { icon: Hash,     label: "Transcript Hash",     value: "a3f9c2…d17e" },
  { icon: Clock,    label: "Issued",              value: "2026-05-18 · Solana" },
];

const attrs = [
  "Permanent",
  "Portable",
  "Tamper-Proof",
  "Non-Transferable",
  "On-Chain",
  "Verifiable",
];

export default function CertificateSection() {
  return (
    <section id="certificates" className="relative section-py overflow-hidden bg-dots">
      <div className="aurora-orb w-[600px] h-[600px] bg-teal-700/12 top-1/2 -translate-y-1/2 right-0" style={{ animationDelay: "-8s" }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[11px] font-medium text-zinc-600 tracking-[0.22em] uppercase mb-6"
            >
              Certificate Showcase
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6"
            >
              Proof of Intelligence{" "}
              <span className="text-gradient-cyan">NFT</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 text-[16px] leading-relaxed mb-10"
            >
              Every exam generates a soulbound NFT on Solana — non-transferable by design,
              permanently linked to the holder&apos;s wallet, and verifiable by anyone on-chain.
            </motion.p>

            {/* Feature list */}
            <div className="space-y-4 mb-10">
              {[
                { title: "Exam Title",         desc: "Exactly what was examined and who authored it." },
                { title: "Student Wallet",     desc: "Immutably linked to the credential holder's identity." },
                { title: "Final Score",        desc: "AI-evaluated score with full transparency." },
                { title: "Integrity Metrics",  desc: "Proctoring data embedded in on-chain metadata." },
                { title: "Transcript Hash",    desc: "SHA-256 hash of the full exam transcript." },
                { title: "Timestamp",          desc: "Block-confirmed issuance time on Solana mainnet." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="text-white text-[14px] font-medium">{item.title}</span>
                    <span className="text-zinc-500 text-[14px]"> — {item.desc}</span>
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {attrs.map((a, i) => (
                <motion.span
                  key={a}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="glass rounded-full px-4 py-1.5 text-[12px] font-medium text-teal-300 border-teal-500/20"
                >
                  {a}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Right: NFT card mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="flex justify-center"
          >
            <div className="relative animate-float">
              <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-[0_0_0_1px_rgba(20,184,166,0.3),0_40px_100px_rgba(0,0,0,0.9),0_0_80px_rgba(20,184,166,0.1)]">
                {/* Card gradient header */}
                <div className="relative h-36 bg-gradient-to-br from-teal-900/80 via-cyan-900/60 to-violet-900/60 overflow-hidden">
                  <div className="absolute inset-0 bg-grid opacity-30" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.2),transparent)]" />
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-teal-400/80 font-medium tracking-widest uppercase mb-1">Cortix · Solana</p>
                      <p className="text-white font-bold text-lg leading-tight">Proof of<br />Intelligence</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
                      <Award className="h-7 w-7 text-teal-300" />
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="bg-black/90 border border-teal-500/15 border-t-0 rounded-b-3xl p-5 space-y-2.5">
                  {metadata.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-zinc-600" />
                        <span className="text-[11px] text-zinc-500">{label}</span>
                      </div>
                      <span className="text-[12px] font-medium text-zinc-200">{value}</span>
                    </div>
                  ))}

                  <div className="pt-3 mt-1 border-t border-white/[0.05]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-600">Token Standard</span>
                      <span className="text-[11px] font-medium text-teal-400">Soulbound · Non-transferable</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl bg-teal-500/8 blur-2xl -z-10 scale-110" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
