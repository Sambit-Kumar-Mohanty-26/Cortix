"use client";

import { useState } from "react";
import { Search, Bell, Copy, Check } from "lucide-react";
import { AuthUser } from "@/context/AuthContext";

export default function TopBar({ user }: { user: AuthUser }) {
  const [copied, setCopied] = useState(false);

  function copyWallet() {
    if (!user.walletAddress) return;
    navigator.clipboard.writeText(user.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const short = user.walletAddress
    ? `${user.walletAddress.slice(0, 5)}...${user.walletAddress.slice(-4)}`
    : null;

  return (
    <header className="h-16 flex items-center gap-4 px-6 border-b border-white/[0.06] bg-black/90 backdrop-blur-xl shrink-0">

      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
          <input
            type="text"
            placeholder="Search assessments..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">

        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl glass text-zinc-500 hover:text-white transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-violet-500 rounded-full ring-2 ring-black" />
        </button>

        {/* Wallet */}
        {short && (
          <button
            onClick={copyWallet}
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-violet-500/10 border border-violet-500/25 rounded-xl text-xs font-mono text-violet-300 hover:bg-violet-500/18 transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {copied ? "Copied!" : short}
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-50" />}
          </button>
        )}

        {/* Profile */}
        <div className="flex items-center gap-2.5 px-3 py-2 glass rounded-xl">
          <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white">
            {user.name?.charAt(0).toUpperCase() || "E"}
          </div>
          <span className="text-xs text-zinc-400 hidden sm:block max-w-[100px] truncate">
            {user.name?.split(" ")[0] || "Examiner"}
          </span>
        </div>
      </div>
    </header>
  );
}
