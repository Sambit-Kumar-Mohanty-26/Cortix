"use client";

import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    desc: "Perfect for trying Cortix and running your first AI oral exams.",
    cta: "Get Started",
    ctaStyle: "btn-outline w-full py-3 text-[15px]",
    highlight: false,
    features: [
      "10 exams per month",
      "AI oral examiner",
      "Basic proctoring",
      "PDF upload (up to 50MB)",
      "Score & feedback report",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    desc: "Unlimited exams, full analytics, and NFT certificate minting on Solana.",
    cta: "Start Pro Free",
    ctaStyle: "btn-white w-full py-3 text-[15px] shadow-[0_0_30px_rgba(255,255,255,0.12)]",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Unlimited exams",
      "Advanced AI examiner",
      "Full proctoring suite",
      "Unlimited PDF uploads",
      "NFT certificate minting",
      "Analytics dashboard",
      "Session recordings",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    desc: "White-label platform, SSO, custom AI models, and dedicated infrastructure.",
    cta: "Book a Demo",
    ctaStyle: "btn-outline w-full py-3 text-[15px]",
    highlight: false,
    features: [
      "Everything in Pro",
      "White-label branding",
      "SSO / SAML integration",
      "Custom AI models",
      "Bulk NFT minting",
      "Dedicated infrastructure",
      "SLA guarantee",
      "Dedicated account manager",
    ],
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative section-py overflow-hidden">
      <div className="aurora-orb w-[600px] h-[600px] bg-violet-700/12 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" style={{ animationDelay: "-1s" }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-medium text-zinc-600 tracking-[0.22em] uppercase mb-5"
          >
            Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6"
          >
            Simple,{" "}
            <span className="text-gradient-hero">transparent</span>{" "}
            pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 text-lg max-w-lg mx-auto"
          >
            Start free. Scale when you need to. Cancel anytime.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
              className={`relative rounded-2xl p-8 flex flex-col ${plan.highlight ? "pricing-pro md:scale-[1.04] md:-my-4 z-10" : "glass border-white/[0.07]"}`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-semibold px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                    <Zap className="h-3 w-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-8">
                <p className="text-zinc-400 text-sm font-medium mb-4">{plan.name}</p>
                <div className="flex items-end gap-1.5 mb-3">
                  <span className="text-5xl font-bold tracking-tight text-white">{plan.price}</span>
                  <span className="text-zinc-500 text-sm mb-2">/{plan.period}</span>
                </div>
                <p className="text-zinc-500 text-[14px] leading-snug">{plan.desc}</p>
              </div>

              {/* CTA */}
              <a href="#start" className={plan.ctaStyle}>
                {plan.cta}
              </a>

              {/* Divider */}
              <div className="divider my-7" />

              {/* Features */}
              <ul className="space-y-3.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-violet-400" : "text-zinc-500"}`} />
                    <span className="text-zinc-300 text-[14px]">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-zinc-600 text-sm mt-12"
        >
          All plans include 256-bit encryption, GDPR compliance, and Solana devnet testing.
        </motion.p>
      </div>
    </section>
  );
}
