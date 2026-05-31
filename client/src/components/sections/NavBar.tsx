"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Product",      href: "#product" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features",     href: "#features" },
  { label: "Proctoring",   href: "#proctoring" },
  { label: "Certificates", href: "#certificates" },
  { label: "Pricing",      href: "#pricing" },
  { label: "FAQ",          href: "#faq" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/75 backdrop-blur-2xl border-b border-white/[0.05] shadow-[0_1px_0_rgba(255,255,255,0.03)]"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 h-[66px]">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-cyan-500" />
              <div className="absolute inset-[2px] bg-black rounded-[9px] flex items-center justify-center">
                <span className="text-white font-black text-sm tracking-tight">C</span>
              </div>
            </div>
            <div className="leading-none">
              <div className="text-[15px] font-semibold tracking-tight text-white">Cortix</div>
              <div className="text-[9.5px] text-zinc-600 tracking-[0.16em] uppercase mt-0.5 font-medium">
                Proof of Intelligence
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13px] font-medium text-zinc-500 hover:text-white transition-colors duration-200 relative group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="/auth?tab=login" className="btn-outline text-sm px-5 py-2">
              Log In
            </a>
            <a href="/auth?tab=signup" className="btn-white text-sm px-5 py-2 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
              Get Started
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-[66px] z-40 bg-black/96 backdrop-blur-3xl border-b border-white/[0.05] lg:hidden"
          >
            <div className="px-5 py-7 flex flex-col gap-2">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-[15px] text-zinc-300 hover:text-white py-2 px-1 transition-colors border-b border-white/[0.04] last:border-0"
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-5 flex flex-col gap-3">
                <a href="/auth?tab=login" className="btn-outline text-sm text-center py-3">Log In</a>
                <a href="/auth?tab=signup" className="btn-white text-sm text-center py-3">Get Started</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
