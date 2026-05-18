"use client";

import { motion } from "framer-motion";
import { GraduationCap, Lightbulb, Briefcase, Building2, BadgeCheck, Globe } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const cases = [
  {
    icon: GraduationCap,
    title: "Universities",
    desc: "Remote viva voce examinations and thesis defences with full integrity guarantees.",
    tag: "Academic",
    accent: "violet",
  },
  {
    icon: Lightbulb,
    title: "EdTech Platforms",
    desc: "Authentic skill certification that goes beyond quizzes and completion badges.",
    tag: "Education",
    accent: "indigo",
  },
  {
    icon: Briefcase,
    title: "Hiring Teams",
    desc: "Technical interviews and knowledge assessments with verifiable, sharable results.",
    tag: "Recruiting",
    accent: "blue",
  },
  {
    icon: Building2,
    title: "Corporate Training",
    desc: "Validate employee knowledge post-training with tamper-proof completion records.",
    tag: "Enterprise",
    accent: "cyan",
  },
  {
    icon: BadgeCheck,
    title: "Certification Bodies",
    desc: "Issue fraud-proof professional credentials recognised across organisations.",
    tag: "Compliance",
    accent: "teal",
  },
  {
    icon: Globe,
    title: "DAOs & Web3",
    desc: "On-chain proof of expertise for community roles, grants, and governance voting.",
    tag: "Web3",
    accent: "purple",
  },
];

const accentMap: Record<string, { border: string; tag: string; icon: string; bg: string }> = {
  violet: { border: "border-violet-500/15", tag: "bg-violet-500/10 text-violet-400", icon: "text-violet-400", bg: "bg-violet-500/5" },
  indigo: { border: "border-indigo-500/15", tag: "bg-indigo-500/10 text-indigo-400", icon: "text-indigo-400", bg: "bg-indigo-500/5" },
  blue:   { border: "border-blue-500/15",   tag: "bg-blue-500/10 text-blue-400",     icon: "text-blue-400",   bg: "bg-blue-500/5" },
  cyan:   { border: "border-cyan-500/15",   tag: "bg-cyan-500/10 text-cyan-400",     icon: "text-cyan-400",   bg: "bg-cyan-500/5" },
  teal:   { border: "border-teal-500/15",   tag: "bg-teal-500/10 text-teal-400",     icon: "text-teal-400",   bg: "bg-teal-500/5" },
  purple: { border: "border-purple-500/15", tag: "bg-purple-500/10 text-purple-400", icon: "text-purple-400", bg: "bg-purple-500/5" },
};

export default function UseCasesSection() {
  return (
    <section className="relative section-py overflow-hidden">
      <div className="aurora-orb w-[500px] h-[500px] bg-indigo-700/10 top-1/3 right-0" style={{ animationDelay: "-5s" }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-medium text-zinc-600 tracking-[0.22em] uppercase mb-5"
          >
            Use Cases
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6"
          >
            Built for Every{" "}
            <span className="text-gradient-purple">Assessment Context</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 text-lg max-w-xl mx-auto"
          >
            From university vivas to DAO governance — Cortix adapts to where intelligence matters.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cases.map((c, i) => {
            const Icon = c.icon;
            const a = accentMap[c.accent];
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
                className={`glass-hover rounded-2xl p-7 ${a.border} relative overflow-hidden group`}
              >
                <div className={`absolute inset-0 ${a.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none`} />
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 ${a.icon}`} />
                  </div>
                  <span className={`text-[10px] font-semibold tracking-wider uppercase rounded-full px-2.5 py-1 ${a.tag}`}>
                    {c.tag}
                  </span>
                </div>
                <h3 className="text-[17px] font-semibold text-white mb-2">{c.title}</h3>
                <p className="text-zinc-400 text-[14px] leading-relaxed">{c.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
