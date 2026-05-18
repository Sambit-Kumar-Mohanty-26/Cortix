"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const testimonials = [
  {
    quote: "Cortix makes academic integrity possible again. We've completely eliminated ChatGPT-assisted cheating in our remote viva programme.",
    name: "Dr. Sarah Osei",
    title: "Head of Assessment, University of Edinburgh",
    initials: "SO",
    accent: "violet",
  },
  {
    quote: "The future of trustworthy certification. Our candidates can now share a verifiable credential that employers actually trust — because it lives on-chain.",
    name: "Marcus Chen",
    title: "CTO, LearnChain EdTech",
    initials: "MC",
    accent: "cyan",
  },
  {
    quote: "A brilliant fusion of AI and blockchain. We use Cortix to verify technical knowledge before granting DAO governance rights. The integrity metrics give our community confidence.",
    name: "Priya Nair",
    title: "Community Lead, Solana Builders DAO",
    initials: "PN",
    accent: "teal",
  },
];

const accentMap: Record<string, { avatar: string; border: string; quote: string }> = {
  violet: { avatar: "bg-violet-500/20 text-violet-300 border-violet-500/30", border: "border-violet-500/10", quote: "text-violet-400/60" },
  cyan:   { avatar: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",       border: "border-cyan-500/10",   quote: "text-cyan-400/60" },
  teal:   { avatar: "bg-teal-500/20 text-teal-300 border-teal-500/30",       border: "border-teal-500/10",   quote: "text-teal-400/60" },
};

export default function TestimonialsSection() {
  return (
    <section className="relative section-py overflow-hidden bg-dots">
      <div className="aurora-orb w-[500px] h-[500px] bg-violet-800/10 top-0 left-1/2 -translate-x-1/2" style={{ animationDelay: "-3s" }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-medium text-zinc-600 tracking-[0.22em] uppercase mb-5"
          >
            Testimonials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight"
          >
            Trusted by the{" "}
            <span className="text-shimmer">best minds</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => {
            const a = accentMap[t.accent];
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
                className={`glass-hover rounded-2xl p-8 ${a.border} flex flex-col`}
              >
                {/* Quotation mark */}
                <div className={`text-6xl font-serif leading-none mb-4 ${a.quote}`}>&ldquo;</div>
                <p className="text-zinc-300 text-[15px] leading-relaxed flex-1 mb-8">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/[0.05]">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-[13px] font-bold flex-shrink-0 ${a.avatar}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white text-[13px] font-semibold">{t.name}</p>
                    <p className="text-zinc-500 text-[12px]">{t.title}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
