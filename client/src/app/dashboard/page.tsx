"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * Dashboard root — redirects to the role-appropriate dashboard.
 */
export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth");
      return;
    }

    router.replace(
      user.role === "examiner" ? "/dashboard/examiner" : "/dashboard/candidate"
    );
  }, [user, loading, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Loader2
        size={36}
        style={{ color: "#7c3aed", animation: "spin 0.7s linear infinite" }}
      />
    </div>
  );
}
