"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

export interface AuthUser {
  id: number;
  name: string | null;
  email: string | null;
  role: "examiner" | "candidate";
  walletAddress: string | null;
  walletType: "managed" | "external";
  authProvider: "google" | "email" | "wallet";
  plan: "free" | "pro";
  planStatus: "active" | "pending_payment" | "cancelled";
  createdAt: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${SERVER_URL}/auth/session`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${SERVER_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore errors — clear local state regardless
    }
    setUser(null);
    router.push("/auth");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
