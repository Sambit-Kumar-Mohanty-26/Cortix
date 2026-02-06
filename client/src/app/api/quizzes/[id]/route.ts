import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

type RouteContext = {
    params: Promise<{ id: string }>;
};

// GET /api/quizzes/[id] - Get a single quiz by ID
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const quizId = parseInt(id, 10);

        if (isNaN(quizId)) {
            return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });
        }

        const [quiz] = await db
            .select()
            .from(schema.quizzes)
            .where(eq(schema.quizzes.id, quizId))
            .limit(1);

        if (!quiz) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }

        return NextResponse.json(quiz);
    } catch (error) {
        console.error("Error fetching quiz:", error);
        return NextResponse.json(
            { error: "Failed to fetch quiz" },
            { status: 500 }
        );
    }
}

// DELETE /api/quizzes/[id] - Delete a quiz
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const quizId = parseInt(id, 10);

        if (isNaN(quizId)) {
            return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });
        }

        const [deletedQuiz] = await db
            .delete(schema.quizzes)
            .where(eq(schema.quizzes.id, quizId))
            .returning();

        if (!deletedQuiz) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Quiz deleted successfully" });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        return NextResponse.json(
            { error: "Failed to delete quiz" },
            { status: 500 }
        );
    }
}

// PATCH /api/quizzes/[id] - Toggle quiz active status
export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const quizId = parseInt(id, 10);

        if (isNaN(quizId)) {
            return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });
        }

        const body = await request.json();
        const { isActive } = body;

        if (typeof isActive !== "boolean") {
            return NextResponse.json(
                { error: "isActive must be a boolean" },
                { status: 400 }
            );
        }

        const [updatedQuiz] = await db
            .update(schema.quizzes)
            .set({ isActive })
            .where(eq(schema.quizzes.id, quizId))
            .returning();

        if (!updatedQuiz) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }

        return NextResponse.json(updatedQuiz);
    } catch (error) {
        console.error("Error updating quiz:", error);
        return NextResponse.json(
            { error: "Failed to update quiz" },
            { status: 500 }
        );
    }
}
