"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle2 } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const problems = [
  "Students copy answers directly from ChatGPT",
  "Written assignments are trivially faked",
  "Multiple-choice tests reward guessing, not understanding",
  "Certificates are impossible to verify authentically",
];

const solutions = [
  "Real-time verbal responses can't be AI-generated",
  "Oral reasoning reveals genuine comprehension",
  "Gaze & tab-switch tracking prevents cheating",
  "Cryptographic on-chain certificates are tamper-proof",
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: EASE },
  }),
};

export default function ProblemSection() {
  return (
    <section id="product" className="relative section-py overflow-hidden">
      <div className="aurora-orb w-[500px] h-[500px] bg-red-900/15 -top-32 -left-40" style={{ animationDelay: "-3s" }} />
      <div className="aurora-orb w-[400px] h-[400px] bg-violet-800/15 -bottom-20 -right-20" style={{ animationDelay: "-7s" }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-medium text-zinc-600 tracking-[0.22em] uppercase mb-5 text-center"
        >
          The Problem
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-center mb-6"
        >
          Traditional Exams Are{" "}
          <span className="text-gradient-warm">Broken.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-500 text-lg text-center max-w-2xl mx-auto mb-20"
        >
          The AI era has made cheating trivially easy. Written tests and multiple-choice exams
          no longer distinguish understanding from imitation.
        </motion.p>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="glass rounded-2xl p-8 border-red-500/[0.08] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 to-transparent pointer-events-none rounded-2xl" />
            <p className="text-[11px] font-medium text-red-400/70 tracking-[0.2em] uppercase mb-6">Without Cortix</p>
            <h3 className="text-2xl font-semibold mb-8 text-white">The Old Way Fails</h3>
            <ul className="space-y-5">
              {problems.map((p, i) => (
                <motion.li
                  key={p}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-start gap-3.5"
                >
                  <XCircle className="h-5 w-5 text-red-400/70 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-400 text-[15px] leading-snug">{p}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="glass rounded-2xl p-8 border-violet-500/[0.15] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 to-transparent pointer-events-none rounded-2xl" />
            <p className="text-[11px] font-medium text-violet-400/70 tracking-[0.2em] uppercase mb-6">With Cortix</p>
            <h3 className="text-2xl font-semibold mb-8 text-white">Cortix Changes That</h3>
            <ul className="space-y-5">
              {solutions.map((s, i) => (
                <motion.li
                  key={s}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-start gap-3.5"
                >
                  <CheckCircle2 className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300 text-[15px] leading-snug">{s}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 pt-8 border-t border-white/[0.05]">
              <p className="text-zinc-400 text-[14px] leading-relaxed">
                Students answer questions verbally, reason in real time, and receive a
                cryptographically verified{" "}
                <span className="text-gradient-purple font-medium">Proof of Intelligence</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
