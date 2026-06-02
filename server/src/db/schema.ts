import { pgTable, serial, text, boolean, jsonb, timestamp, integer, uuid } from "drizzle-orm/pg-core";

// Users 
export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  name: text("name"),
  email: text("email").unique(),
  passwordHash: text("password_hash"),

  // 'google' | 'email' | 'wallet'
  authProvider: text("auth_provider").notNull().default("wallet"),

  // 'examiner' | 'candidate'
  role: text("role").notNull().default("candidate"),

  walletAddress: text("wallet_address").unique(),
  // 'managed' | 'external'
  walletType: text("wallet_type").notNull().default("managed"),
  encryptedPrivateKey: text("encrypted_private_key"),

  googleId: text("google_id").unique(),

  // Plan - only relevant for examiners
  plan: text("plan").default("free"),
  planStatus: text("plan_status").default("active"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quizzes
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

// Submissions
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
