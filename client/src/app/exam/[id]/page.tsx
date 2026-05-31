"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Clock, BookOpen, ArrowLeft, Play, Loader2, AlertTriangle } from "lucide-react";
import HardwareCheck from "@/components/exam/HardwareCheck";
import "./exam.css";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    difficulty: string | null;
    timeLimitSeconds: number | null;
    isActive: boolean | null;
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ExamLobbyPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [permissionsGranted, setPermissionsGranted] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/quizzes/${id}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        setError("Quiz not found");
                    } else {
                        setError("Failed to load quiz");
                    }
                    return;
                }

                const data = await response.json();

                if (!data.isActive) {
                    setError("This quiz is no longer active");
                    return;
                }

                setQuiz(data);
            } catch (err) {
                console.error("Error fetching quiz:", err);
                setError("Failed to load quiz");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [id]);

    const handlePermissionsChange = useCallback((granted: boolean) => {
        setPermissionsGranted(granted);
    }, []);

    const handleStartExam = () => {
        // TODO: Navigate to actual exam page
        alert("Exam would start now! (Exam page not yet implemented)");
    };

    const formatTime = (seconds: number | null) => {
        if (!seconds) return "3 minutes";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (secs === 0) return `${mins} minute${mins > 1 ? "s" : ""}`;
        return `${mins}m ${secs}s`;
    };

    if (loading) {
        return (
            <div className="exam-lobby-container">
                <div className="loading-screen">
                    <Loader2 size={48} className="spin" />
                    <p>Loading exam...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="exam-lobby-container">
                <div className="error-screen">
                    <AlertTriangle size={64} />
                    <h1>{error}</h1>
                    <p>The exam you&apos;re looking for doesn&apos;t exist or is no longer available.</p>
                    <button className="back-btn" onClick={() => router.push("/")}>
                        <ArrowLeft size={18} />
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="exam-lobby-container">
            <header className="lobby-header">
                <button className="back-link" onClick={() => router.back()}>
                    <ArrowLeft size={18} />
                    Back
                </button>
            </header>

            <main className="lobby-main">
                <div className="exam-info-card">
                    <div className="exam-badge">
                        <BookOpen size={20} />
                        Oral Examination
                    </div>

                    <h1 className="exam-title">{quiz?.title}</h1>

                    {quiz?.description && (
                        <p className="exam-description">{quiz.description}</p>
                    )}

                    <div className="exam-meta">
                        <div className="meta-item">
                            <Clock size={18} />
                            <span>Time Limit: {formatTime(quiz?.timeLimitSeconds ?? null)}</span>
                        </div>
                        <div className="meta-item">
                            <span className={`difficulty-badge ${quiz?.difficulty || "medium"}`}>
                                {quiz?.difficulty || "medium"} difficulty
                            </span>
                        </div>
                    </div>

                    <div className="exam-rules">
                        <h3>Before you begin:</h3>
                        <ul>
                            <li>Ensure you&apos;re in a quiet, well-lit environment</li>
                            <li>The AI examiner will ask you questions verbally</li>
                            <li>Speak clearly and answer naturally</li>
                            <li>Your webcam will be active for proctoring</li>
                            <li>Switching tabs may be flagged as suspicious</li>
                        </ul>
                    </div>
                </div>

                <div className="hardware-section">
                    <HardwareCheck onPermissionsGranted={handlePermissionsChange} />

                    <button
                        className={`start-exam-btn ${permissionsGranted ? "ready" : "disabled"}`}
                        disabled={!permissionsGranted}
                        onClick={handleStartExam}
                    >
                        <Play size={20} />
                        {permissionsGranted ? "Start Exam" : "Grant Permissions to Continue"}
                    </button>
                </div>
            </main>
        </div>
    );
}
