import { pgTable, serial, text, boolean, jsonb, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").unique().notNull(),
  role: text("role").default("student"), // 'creator' or 'student'
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  creatorWallet: text("creator_wallet").notNull(),
  
  title: text("title").notNull(),
  description: text("description"),
  
  contextMaterial: text("context_material").notNull(), 
  
  difficulty: text("difficulty").default("medium"),
  timeLimitSeconds: integer("time_limit_seconds").default(180),

  systemPrompt: text("system_prompt"), 

  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id), 
  studentWallet: text("student_wallet").notNull(),
  
  transcript: jsonb("transcript"),
  audioUrl: text("audio_url"), 
  
  score: integer("score"),
  feedback: text("feedback"),
  
  status: text("status").default("pending"),
  
  tabSwitches: integer("tab_switches").default(0),
  suspiciousGazeCount: integer("suspicious_gaze_count").default(0),
  
  nftMintAddress: text("nft_mint_address"), 
  createdAt: timestamp("created_at").defaultNow(),
});