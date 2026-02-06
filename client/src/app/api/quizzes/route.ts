import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

// POST /api/quizzes - Create a new quiz
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { creatorWallet, title, description, contextMaterial, difficulty, timeLimitSeconds, systemPrompt } = body;

        if (!creatorWallet || !title || !contextMaterial) {
            return NextResponse.json(
                { error: "Missing required fields: creatorWallet, title, contextMaterial" },
                { status: 400 }
            );
        }

        const [newQuiz] = await db
            .insert(schema.quizzes)
            .values({
                creatorWallet,
                title,
                description: description || null,
                contextMaterial,
                difficulty: difficulty || "medium",
                timeLimitSeconds: timeLimitSeconds || 180,
                systemPrompt: systemPrompt || null,
                isActive: true,
            })
            .returning();

        return NextResponse.json(newQuiz, { status: 201 });
    } catch (error) {
        console.error("Error creating quiz:", error);
        return NextResponse.json(
            { error: "Failed to create quiz" },
            { status: 500 }
        );
    }
}

// GET /api/quizzes?wallet=<address> - List quizzes by creator wallet
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const wallet = searchParams.get("wallet");

        if (!wallet) {
            return NextResponse.json(
                { error: "Missing wallet query parameter" },
                { status: 400 }
            );
        }

        const quizzes = await db
            .select()
            .from(schema.quizzes)
            .where(eq(schema.quizzes.creatorWallet, wallet))
            .orderBy(schema.quizzes.createdAt);

        return NextResponse.json(quizzes);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return NextResponse.json(
            { error: "Failed to fetch quizzes" },
            { status: 500 }
        );
    }
}
