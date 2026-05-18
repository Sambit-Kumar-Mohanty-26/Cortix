"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const cols = [
  {
    heading: "Product",
    links: ["Features", "Pricing", "Security", "Roadmap"],
    hrefs: ["#features", "#pricing", "#", "#"],
  },
  {
    heading: "Solutions",
    links: ["Universities", "Hiring Teams", "Corporate Training", "Certification Bodies"],
    hrefs: ["#", "#", "#", "#"],
  },
  {
    heading: "Resources",
    links: ["Documentation", "API Reference", "Blog", "Support"],
    hrefs: ["#", "#", "#", "#"],
  },
  {
    heading: "Company",
    links: ["About", "Contact", "Privacy Policy", "Terms of Service"],
    hrefs: ["#", "#", "#", "#"],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] overflow-hidden">
      <div className="aurora-orb w-[500px] h-[500px] bg-violet-900/8 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="col-span-2 md:col-span-1"
          >
            <a href="/" className="flex items-center gap-3 mb-5 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-cyan-500" />
                <div className="absolute inset-[2px] bg-black rounded-[9px] flex items-center justify-center">
                  <span className="text-white font-black text-sm">C</span>
                </div>
              </div>
              <div>
                <div className="text-[15px] font-semibold tracking-tight text-white">Cortix</div>
                <div className="text-[9px] text-zinc-600 tracking-[0.15em] uppercase font-medium">Proof of Intelligence</div>
              </div>
            </a>
            <p className="text-zinc-600 text-[13px] leading-relaxed max-w-[200px]">
              AI-powered oral exams with on-chain credential verification.
            </p>
          </motion.div>

          {/* Link columns */}
          {cols.map((col, i) => (
            <motion.div
              key={col.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i + 1) * 0.07, ease: EASE }}
            >
              <p className="text-[11px] font-semibold text-zinc-500 tracking-[0.15em] uppercase mb-5">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((link, j) => (
                  <li key={link}>
                    <a
                      href={col.hrefs[j]}
                      className="text-[13px] text-zinc-500 hover:text-zinc-200 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="divider mb-8"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-[12px]">
            © 2026 Cortix. Proving Intelligence, Cryptographically.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Security"].map((item) => (
              <a key={item} href="#" className="text-[12px] text-zinc-600 hover:text-zinc-400 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
