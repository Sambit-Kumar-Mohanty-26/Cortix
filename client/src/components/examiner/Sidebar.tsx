"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, FileText, Users,
  BarChart3, Award, TrendingUp, Settings,
  LogOut, ChevronDown, ChevronRight,
} from "lucide-react";
import { AuthUser } from "@/context/AuthContext";

interface NavChild { id: string; label: string; }
interface NavItem  { id: string; label: string; icon: React.ElementType; children?: NavChild[]; }

const NAV: NavItem[] = [
  { id: "overview",     label: "Overview",     icon: LayoutDashboard },
  { id: "assessments",  label: "Assessments",  icon: FileText, children: [
    { id: "assessments",           label: "All Assessments" },
    { id: "assessments-drafts",    label: "Drafts" },
    { id: "assessments-published", label: "Published" },
  ]},
  { id: "candidates",   label: "Candidates",   icon: Users },
  { id: "results",      label: "Results",      icon: BarChart3 },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "analytics",    label: "Analytics",    icon: TrendingUp },
  { id: "settings",     label: "Settings",     icon: Settings },
];

interface Props {
  activeSection: string;
  onNavigate: (s: string) => void;
  user: AuthUser;
  onLogout: () => void;
}

export default function Sidebar({ activeSection, onNavigate, user, onLogout }: Props) {
  const [expanded, setExpanded] = useState(true);

  const isActive = (item: NavItem) =>
    activeSection === item.id || (item.children?.some(c => c.id === activeSection) ?? false);

  return (
    <aside className="w-60 h-screen flex flex-col shrink-0 border-r border-white/[0.06] bg-[#050508]">

      {/* Logo */}
      <Link href="/" className="flex items-center px-5 h-16 border-b border-white/[0.06] group shrink-0">
        <Image src="/Cortix Logo.png" alt="Cortix" width={36} height={36} className="h-[32px] w-auto object-contain shrink-0 -translate-y-[3px]" />
        <Image src="/Cortix typography.png" alt="Cortix" width={100} height={36} className="h-[32px] w-auto object-contain -ml-1" />
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.children) { setExpanded(e => !e); if (!active) onNavigate(item.id); }
                  else onNavigate(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05] border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-violet-400" : ""}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.children && (expanded && active
                  ? <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                  : <ChevronRight className="w-3.5 h-3.5 opacity-30" />
                )}
              </button>

              {item.children && expanded && active && (
                <div className="ml-7 mt-1 space-y-0.5">
                  {item.children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => onNavigate(child.id)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all ${
                        activeSection === child.id
                          ? "text-violet-300 bg-violet-500/10 font-semibold"
                          : "text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04]"
                      }`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/[0.06] px-3 py-4 space-y-1 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user.name?.charAt(0).toUpperCase() || "E"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user.name || "Examiner"}</p>
            <p className="text-[11px] text-zinc-600 capitalize">{user.plan === "pro" ? "✦ Pro" : "Free Plan"}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/[0.08] transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
