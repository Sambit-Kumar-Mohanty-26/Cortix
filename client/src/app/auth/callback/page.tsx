"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * Google OAuth callback handler.
 * The server already sets the session cookie and redirects here with ?welcome=true.
 * We just need to refresh the auth context and push to the right dashboard.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();

  useEffect(() => {
    async function handleCallback() {
      await refreshUser();
    }
    handleCallback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading && user) {
      router.replace(
        user.role === "examiner" ? "/dashboard/examiner" : "/dashboard/candidate"
      );
    }
    if (!loading && !user) {
      router.replace("/auth?error=google_failed");
    }
  }, [user, loading, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
      }}
    >
      <Loader2
        size={40}
        style={{ color: "#7c3aed", animation: "spin 0.7s linear infinite" }}
      />
      <p style={{ color: "#71717a", fontSize: "0.9rem" }}>
        Completing sign-in...
      </p>
    </div>
  );
}
