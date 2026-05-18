"use client";

import { motion } from "framer-motion";
import { Upload, Mic2, Eye, Brain, Award } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const steps = [
  {
    n: "01",
    icon: Upload,
    title: "Upload Your Study Material",
    desc: "Add notes, textbooks, PDFs, or research papers. Cortix extracts key concepts and builds a dynamic question bank grounded in your content.",
    color: "from-violet-600/20 to-violet-600/5",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    n: "02",
    icon: Mic2,
    title: "AI Conducts the Viva",
    desc: "The AI examiner asks spoken questions, listens carefully to responses, and dynamically adapts follow-ups based on what the student says.",
    color: "from-indigo-600/20 to-indigo-600/5",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
  },
  {
    n: "03",
    icon: Eye,
    title: "Real-Time Proctoring",
    desc: "Eye gaze tracking, tab-switch detection, full-screen enforcement, and ambient voice monitoring run continuously throughout the session.",
    color: "from-blue-600/20 to-blue-600/5",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    n: "04",
    icon: Brain,
    title: "Instant AI Evaluation",
    desc: "Responses are scored for depth of understanding, reasoning quality, and communication clarity. Detailed feedback is generated in seconds.",
    color: "from-cyan-600/20 to-cyan-600/5",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    n: "05",
    icon: Award,
    title: "Mint Proof of Intelligence",
    desc: "A non-transferable soulbound NFT certificate is minted on Solana, containing the exam transcript, integrity metrics, and final score — permanently on-chain.",
    color: "from-teal-600/20 to-teal-600/5",
    border: "border-teal-500/20",
    iconColor: "text-teal-400",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative section-py overflow-hidden bg-dots">
      <div className="aurora-orb w-[600px] h-[600px] bg-indigo-700/12 top-1/2 -translate-y-1/2 -right-48" style={{ animationDelay: "-4s" }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-medium text-zinc-600 tracking-[0.22em] uppercase mb-5"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6"
          >
            From Upload to{" "}
            <span className="text-gradient-purple">Certificate</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 text-lg max-w-xl mx-auto"
          >
            Five steps. Fully automated. End-to-end verifiable.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-[39px] top-10 bottom-10 w-px bg-gradient-to-b from-violet-500/50 via-cyan-500/30 to-teal-500/20 hidden md:block" />

          <div className="space-y-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.65, delay: i * 0.08, ease: EASE }}
                  className="flex gap-6 group"
                >
                  {/* Step indicator */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} border ${step.border} flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className={`h-7 w-7 ${step.iconColor}`} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-black border border-white/10 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-zinc-500">{step.n}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 glass rounded-2xl p-6 border ${step.border} group-hover:border-opacity-40 transition-all duration-300`}>
                    <h3 className="text-[18px] font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-zinc-400 text-[14.5px] leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
