"use client";

import { motion } from "framer-motion";

const logos = [
  "MIT",  "Stanford", "Harvard", "OpenAI", "Solana",
  "Coinbase", "Coursera", "edX", "Google", "Microsoft",
  "MIT",  "Stanford", "Harvard", "OpenAI", "Solana",
  "Coinbase", "Coursera", "edX", "Google", "Microsoft",
];

export default function LogoStrip() {
  return (
    <section className="relative py-16 overflow-hidden border-y border-white/[0.04]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_50%_50%,rgba(139,92,246,0.04),transparent)]" />

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center text-[11px] font-medium text-zinc-600 tracking-[0.22em] uppercase mb-10"
      >
        Trusted institutions &amp; platforms
      </motion.p>

      {/* Gradient masks */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />

        <div className="flex overflow-hidden">
          <div className="flex animate-marquee gap-16 items-center whitespace-nowrap">
            {logos.map((name, i) => (
              <span
                key={i}
                className="text-zinc-600 font-semibold text-[15px] tracking-wide hover:text-zinc-400 transition-colors duration-300 flex-shrink-0"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
