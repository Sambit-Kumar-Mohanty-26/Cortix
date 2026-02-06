"use client";

import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LayoutDashboard, Loader2 } from "lucide-react";
import QuizForm from "@/components/dashboard/QuizForm";
import QuizTable from "@/components/dashboard/QuizTable";
import "./dashboard.css";

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    difficulty: string | null;
    timeLimitSeconds: number | null;
    isActive: boolean | null;
    createdAt: string | null;
}

export default function DashboardPage() {
    const { publicKey, connected } = useWallet();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchQuizzes = useCallback(async () => {
        if (!publicKey) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/quizzes?wallet=${publicKey.toBase58()}`);
            if (response.ok) {
                const data = await response.json();
                setQuizzes(data);
            }
        } catch (error) {
            console.error("Failed to fetch quizzes:", error);
        } finally {
            setLoading(false);
        }
    }, [publicKey]);

    useEffect(() => {
        if (connected && publicKey) {
            fetchQuizzes();
        } else {
            setQuizzes([]);
        }
    }, [connected, publicKey, fetchQuizzes]);

    if (!connected) {
        return (
            <div className="dashboard-container">
                <div className="connect-wallet-prompt">
                    <LayoutDashboard size={64} />
                    <h1>Professor Dashboard</h1>
                    <p>Connect your Solana wallet to manage your quizzes</p>
                    <WalletMultiButton />
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="header-title">
                        <LayoutDashboard size={28} />
                        <h1>Professor Dashboard</h1>
                    </div>
                    <WalletMultiButton />
                </div>
            </header>

            <main className="dashboard-main">
                <section className="create-section">
                    <QuizForm
                        walletAddress={publicKey!.toBase58()}
                        onQuizCreated={fetchQuizzes}
                    />
                </section>

                <section className="list-section">
                    {loading ? (
                        <div className="loading-state">
                            <Loader2 size={32} className="spin" />
                            <p>Loading your quizzes...</p>
                        </div>
                    ) : (
                        <QuizTable quizzes={quizzes} onQuizUpdated={fetchQuizzes} />
                    )}
                </section>
            </main>
        </div>
    );
}
