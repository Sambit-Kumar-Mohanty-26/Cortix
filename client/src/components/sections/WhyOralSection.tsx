"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const benefits = [
  { label: "Conceptual Understanding",  desc: "Deep knowledge vs. surface memorisation" },
  { label: "Critical Thinking",         desc: "Real-time problem-solving under pressure" },
  { label: "Reasoning Transparency",    desc: "How conclusions are reached, not just what they are" },
  { label: "Communication Skills",      desc: "Articulation and clarity under examination" },
];

export default function WhyOralSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section ref={ref} className="relative section-py overflow-hidden bg-dots">
      <motion.div style={{ x }} className="aurora-orb w-[700px] h-[700px] bg-violet-800/10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: big statement */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[11px] font-medium text-zinc-600 tracking-[0.22em] uppercase mb-6"
            >
              Why Oral Exams Win
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: EASE }}
              className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1] mb-8"
            >
              AI can generate answers.
              <br />
              <span className="text-gradient-hero">
                It cannot think for the student.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-400 text-lg leading-relaxed mb-10"
            >
              Oral examinations expose what written tests cannot measure —
              genuine understanding that emerges only when a student must
              reason aloud, in real time, without assistance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-block glass rounded-2xl px-6 py-4 border-violet-500/20"
            >
              <p className="text-zinc-300 text-[14px] leading-relaxed italic">
                &ldquo;A student who truly understands can explain it simply.
                A student who copied cannot.&rdquo;
              </p>
            </motion.div>
          </div>

          {/* Right: benefits */}
          <div className="space-y-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className="glass-hover rounded-2xl p-6 border-white/[0.06] group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-violet-500/20 transition-colors">
                    <CheckCircle2 className="h-4.5 w-4.5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-[16px] mb-1">{b.label}</h3>
                    <p className="text-zinc-500 text-[14px]">{b.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
