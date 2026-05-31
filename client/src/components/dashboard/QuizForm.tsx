"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

interface QuizFormProps {
    walletAddress: string;
    onQuizCreated: () => void;
}

export default function QuizForm({ walletAddress, onQuizCreated }: QuizFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        contextMaterial: "",
        difficulty: "medium",
        timeLimitSeconds: 180,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${SERVER_URL}/quizzes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    ...formData,
                    creatorWallet: walletAddress,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create quiz");
            }

            // Reset form
            setFormData({
                title: "",
                description: "",
                contextMaterial: "",
                difficulty: "medium",
                timeLimitSeconds: 180,
            });

            onQuizCreated();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="quiz-form-container">
            <h2 className="form-title">
                <Plus size={20} />
                Create New Quiz
            </h2>

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit} className="quiz-form">
                <div className="form-group">
                    <label htmlFor="title">Quiz Title *</label>
                    <input
                        id="title"
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Introduction to Blockchain"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        id="description"
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of the quiz"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contextMaterial">Knowledge Base *</label>
                    <textarea
                        id="contextMaterial"
                        required
                        rows={5}
                        value={formData.contextMaterial}
                        onChange={(e) => setFormData({ ...formData, contextMaterial: e.target.value })}
                        placeholder="Paste the text/material the AI will study to generate questions..."
                    />
                    <span className="form-hint">The AI will use this content to ask oral examination questions</span>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="difficulty">Difficulty</label>
                        <select
                            id="difficulty"
                            value={formData.difficulty}
                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="timeLimit">Time Limit (seconds)</label>
                        <input
                            id="timeLimit"
                            type="number"
                            min={60}
                            max={3600}
                            value={formData.timeLimitSeconds}
                            onChange={(e) => setFormData({ ...formData, timeLimitSeconds: parseInt(e.target.value) || 180 })}
                        />
                    </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="submit-btn">
                    {isSubmitting ? (
                        <>
                            <Loader2 size={18} className="spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <Plus size={18} />
                            Create Quiz
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
