import { Router, Request, Response } from "express";
import { db, schema } from "../lib/db";
import { eq } from "drizzle-orm";

const router = Router();

// POST /quizzes - Create a new quiz

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      creatorWallet,
      title,
      description,
      contextMaterial,
      difficulty,
      timeLimitSeconds,
      systemPrompt,
    } = req.body;

    if (!creatorWallet || !title || !contextMaterial) {
      return res.status(400).json({
        error: "Missing required fields: creatorWallet, title, contextMaterial",
      });
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

    return res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    return res.status(500).json({ error: "Failed to create quiz" });
  }
});

// GET /quizzes?wallet=<address> - List quizzes by creator wallet

router.get("/", async (req: Request, res: Response) => {
  try {
    const wallet = req.query.wallet as string;

    if (!wallet) {
      return res
        .status(400)
        .json({ error: "Missing wallet query parameter" });
    }

    const quizzes = await db
      .select()
      .from(schema.quizzes)
      .where(eq(schema.quizzes.creatorWallet, wallet))
      .orderBy(schema.quizzes.createdAt);

    return res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// GET /quizzes/:id - Get a single quiz by ID

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const quizId = parseInt(req.params.id as string, 10);

    if (isNaN(quizId)) {
      return res.status(400).json({ error: "Invalid quiz ID" });
    }

    const [quiz] = await db
      .select()
      .from(schema.quizzes)
      .where(eq(schema.quizzes.id, quizId))
      .limit(1);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    return res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

// PATCH /quizzes/:id - Toggle quiz active status

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const quizId = parseInt(req.params.id as string, 10);

    if (isNaN(quizId)) {
      return res.status(400).json({ error: "Invalid quiz ID" });
    }

    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ error: "isActive must be a boolean" });
    }

    const [updatedQuiz] = await db
      .update(schema.quizzes)
      .set({ isActive })
      .where(eq(schema.quizzes.id, quizId))
      .returning();

    if (!updatedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    return res.json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    return res.status(500).json({ error: "Failed to update quiz" });
  }
});

// DELETE /quizzes/:id - Delete a quiz

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const quizId = parseInt(req.params.id as string, 10);

    if (isNaN(quizId)) {
      return res.status(400).json({ error: "Invalid quiz ID" });
    }

    const [deletedQuiz] = await db
      .delete(schema.quizzes)
      .where(eq(schema.quizzes.id, quizId))
      .returning();

    if (!deletedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    return res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return res.status(500).json({ error: "Failed to delete quiz" });
  }
});

export default router;
