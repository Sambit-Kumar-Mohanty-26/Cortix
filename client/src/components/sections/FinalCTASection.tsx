"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function FinalCTASection() {
  return (
    <section id="start" className="relative section-py overflow-hidden">
      {/* Dense aurora for cinematic feel */}
      <div className="aurora-orb w-[700px] h-[700px] bg-violet-700/20 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" style={{ animationDelay: "0s" }} />
      <div className="aurora-orb w-[400px] h-[400px] bg-cyan-600/12 top-0 right-0"                                           style={{ animationDelay: "-5s" }} />
      <div className="aurora-orb w-[300px] h-[300px] bg-indigo-600/12 bottom-0 left-0"                                       style={{ animationDelay: "-9s" }} />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_50%,rgba(139,92,246,0.06),transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="glass rounded-3xl p-12 sm:p-20 border-violet-500/10 relative overflow-hidden shadow-[0_0_0_1px_rgba(139,92,246,0.12),0_60px_120px_rgba(0,0,0,0.8)]"
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-transparent to-cyan-950/20 pointer-events-none" />

          {/* Dot pattern */}
          <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />

          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[11px] font-medium text-zinc-600 tracking-[0.22em] uppercase mb-8"
            >
              Get Started Today
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
              className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] mb-6 leading-[1.05]"
            >
              Ready to Verify{" "}
              <span className="text-gradient-hero">Real Intelligence?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
            >
              Create AI-powered oral exams and issue Proof of Intelligence certificates
              in minutes. No setup fees. No lock-in.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a href="#signup" className="btn-white text-[16px] px-8 py-4 group shadow-[0_0_40px_rgba(255,255,255,0.12)]">
                Start Free — No Card Required
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#demo" className="btn-outline text-[16px] px-8 py-4">
                <Calendar className="h-4 w-4" />
                Book a Live Demo
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-zinc-600 text-[13px] mt-8"
            >
              10 free exams/month · No credit card · Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
