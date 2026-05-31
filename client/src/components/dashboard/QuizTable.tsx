"use client";

import { useState } from "react";
import { Trash2, ToggleLeft, ToggleRight, Loader2, Clock, BookOpen } from "lucide-react";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    difficulty: string | null;
    timeLimitSeconds: number | null;
    isActive: boolean | null;
    createdAt: string | null;
}

interface QuizTableProps {
    quizzes: Quiz[];
    onQuizUpdated: () => void;
}

export default function QuizTable({ quizzes, onQuizUpdated }: QuizTableProps) {
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [actionType, setActionType] = useState<"toggle" | "delete" | null>(null);

    const handleToggle = async (quiz: Quiz) => {
        setLoadingId(quiz.id);
        setActionType("toggle");

        try {
            const response = await fetch(`${SERVER_URL}/quizzes/${quiz.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ isActive: !quiz.isActive }),
            });

            if (!response.ok) throw new Error("Failed to toggle");
            onQuizUpdated();
        } catch (error) {
            console.error("Toggle failed:", error);
        } finally {
            setLoadingId(null);
            setActionType(null);
        }
    };

    const handleDelete = async (quizId: number) => {
        if (!confirm("Are you sure you want to delete this quiz?")) return;

        setLoadingId(quizId);
        setActionType("delete");

        try {
            const response = await fetch(`${SERVER_URL}/quizzes/${quizId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to delete");
            onQuizUpdated();
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setLoadingId(null);
            setActionType(null);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (seconds: number | null) => {
        if (!seconds) return "3 min";
        const mins = Math.floor(seconds / 60);
        return `${mins} min`;
    };

    if (quizzes.length === 0) {
        return (
            <div className="empty-state">
                <BookOpen size={48} />
                <h3>No Quizzes Yet</h3>
                <p>Create your first quiz using the form above</p>
            </div>
        );
    }

    return (
        <div className="quiz-table-container">
            <h2 className="table-title">Your Quizzes ({quizzes.length})</h2>

            <div className="table-wrapper">
                <table className="quiz-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Difficulty</th>
                            <th>Time Limit</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map((quiz) => (
                            <tr key={quiz.id} className={!quiz.isActive ? "inactive" : ""}>
                                <td className="title-cell">
                                    <span className="quiz-title">{quiz.title}</span>
                                    {quiz.description && (
                                        <span className="quiz-description">{quiz.description}</span>
                                    )}
                                </td>
                                <td>
                                    <span className={`difficulty-badge ${quiz.difficulty}`}>
                                        {quiz.difficulty || "medium"}
                                    </span>
                                </td>
                                <td>
                                    <span className="time-cell">
                                        <Clock size={14} />
                                        {formatTime(quiz.timeLimitSeconds)}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${quiz.isActive ? "active" : "inactive"}`}>
                                        {quiz.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="date-cell">{formatDate(quiz.createdAt)}</td>
                                <td className="actions-cell">
                                    <button
                                        className="action-btn toggle-btn"
                                        onClick={() => handleToggle(quiz)}
                                        disabled={loadingId === quiz.id}
                                        title={quiz.isActive ? "Deactivate" : "Activate"}
                                    >
                                        {loadingId === quiz.id && actionType === "toggle" ? (
                                            <Loader2 size={18} className="spin" />
                                        ) : quiz.isActive ? (
                                            <ToggleRight size={18} />
                                        ) : (
                                            <ToggleLeft size={18} />
                                        )}
                                    </button>
                                    <button
                                        className="action-btn delete-btn"
                                        onClick={() => handleDelete(quiz.id)}
                                        disabled={loadingId === quiz.id}
                                        title="Delete quiz"
                                    >
                                        {loadingId === quiz.id && actionType === "delete" ? (
                                            <Loader2 size={18} className="spin" />
                                        ) : (
                                            <Trash2 size={18} />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
