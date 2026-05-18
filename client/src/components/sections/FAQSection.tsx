"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const faqs = [
  {
    q: "How does Cortix prevent cheating?",
    a: "Cortix combines four independent signals: real-time oral responses (impossible to auto-generate on the fly), eye gaze tracking (detects looking away), tab-switch detection (flags any navigation), and ambient voice monitoring (detects additional speakers). Together, these create an integrity score that's far harder to game than written exams.",
  },
  {
    q: "Which wallets are supported?",
    a: "Cortix supports all major Solana wallets including Phantom, Solflare, Backpack, and any WalletConnect-compatible Solana wallet. Authentication is passwordless — just connect your wallet to begin.",
  },
  {
    q: "Can certificates be verified publicly?",
    a: "Yes. Every Proof of Intelligence NFT is minted on Solana mainnet and is publicly verifiable by anyone with the wallet address or NFT token ID. The on-chain metadata includes the exam title, score, integrity metrics, and a hash of the full transcript.",
  },
  {
    q: "Which AI models are used?",
    a: "Cortix uses OpenAI Whisper for real-time speech-to-text transcription and GPT-4 class models for question generation and response evaluation. All inference runs server-side — no audio data leaves your session unencrypted.",
  },
  {
    q: "What happens if a student loses internet during an exam?",
    a: "The session is paused and the partial transcript is preserved. When connection is restored, the student can resume from where they left off. Disconnection events are logged in the integrity report.",
  },
  {
    q: "Is there an API for integration?",
    a: "Yes. Pro and Enterprise plans include full REST API access, enabling you to embed Cortix exam flows directly into your LMS, hiring platform, or DAO tooling. Webhooks are available for real-time exam completion events.",
  },
];

function FAQItem({ item, index }: { item: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: EASE }}
      className={`glass rounded-2xl border-white/[0.06] overflow-hidden transition-all duration-300 ${open ? "border-violet-500/20" : ""}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-7 py-6 text-left group"
      >
        <span className={`text-[16px] font-medium transition-colors ${open ? "text-white" : "text-zinc-300 group-hover:text-white"}`}>
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className={`flex-shrink-0 ml-4 w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${open ? "border-violet-500/50 bg-violet-500/10" : "border-white/10 group-hover:border-white/20"}`}
        >
          <Plus className={`h-4 w-4 ${open ? "text-violet-400" : "text-zinc-400"}`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="px-7 pb-7">
              <div className="divider mb-5" />
              <p className="text-zinc-400 text-[15px] leading-relaxed">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="relative section-py overflow-hidden bg-dots">
      <div className="aurora-orb w-[400px] h-[400px] bg-indigo-700/10 bottom-0 left-1/4" style={{ animationDelay: "-6s" }} />

      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-medium text-zinc-600 tracking-[0.22em] uppercase mb-5"
          >
            FAQ
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-4xl sm:text-5xl font-semibold tracking-tight"
          >
            Common{" "}
            <span className="text-gradient-purple">Questions</span>
          </motion.h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} item={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
