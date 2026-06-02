import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db, schema } from "../lib/db";
import { eq, or } from "drizzle-orm";
import {
  createSession,
  validateSession,
  deleteSession,
  SESSION_COOKIE_NAME,
} from "../lib/session";
import { generateManagedWallet } from "../lib/wallet";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { google } from "googleapis";

const router = Router();

// Cookie helpers
// SameSite=None + Secure is required for cross-domain cookies (Vercel - Render)

const IS_PROD = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: (IS_PROD ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE_NAME, token, COOKIE_OPTIONS);
}

function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: (IS_PROD ? "none" : "lax") as "none" | "lax",
    path: "/",
  });
}

// Google OAuth client

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

// GET /auth/google - Redirect to Google

router.get("/google", (req: Request, res: Response) => {
  const role = (req.query.role as string) || "candidate";
  const oauth2Client = getOAuthClient();
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    state: role, // pass role through OAuth state param
  });
  res.redirect(url);
});

// GET /auth/google/callback

router.get("/google/callback", async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const role = (state as string) || "candidate";
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  if (!code) {
    return res.redirect(`${clientUrl}/auth?error=google_failed`);
  }

  try {
    const oauth2Client = getOAuthClient();
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: googleUser } = await oauth2.userinfo.get();

    if (!googleUser.email || !googleUser.id) {
      return res.redirect(`${clientUrl}/auth?error=google_no_email`);
    }

    // Find or create user
    let [user] = await db
      .select()
      .from(schema.users)
      .where(
        or(
          eq(schema.users.googleId, googleUser.id),
          eq(schema.users.email, googleUser.email)
        )
      );

    if (!user) {
      // New user - generate managed wallet
      const wallet = generateManagedWallet();

      const [newUser] = await db
        .insert(schema.users)
        .values({
          name: googleUser.name || googleUser.email,
          email: googleUser.email,
          googleId: googleUser.id,
          authProvider: "google",
          role,
          walletAddress: wallet.publicKey,
          walletType: "managed",
          encryptedPrivateKey: wallet.encryptedPrivateKey,
        })
        .returning();

      user = newUser;
    } else if (!user.googleId) {
      // Existing email user - link Google account
      const [updated] = await db
        .update(schema.users)
        .set({ googleId: googleUser.id })
        .where(eq(schema.users.id, user.id))
        .returning();
      user = updated;
    }

    const sessionToken = await createSession(user.id);
    setSessionCookie(res, sessionToken);

    const dashboardPath =
      user.role === "examiner" ? "/dashboard/examiner" : "/dashboard/candidate";
    return res.redirect(`${clientUrl}${dashboardPath}?welcome=true`);
  } catch (err) {
    console.error("Google OAuth error:", err);
    return res.redirect(`${clientUrl}/auth?error=google_failed`);
  }
});

// POST /auth/email/signup

router.post("/email/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: "Missing required fields: name, email, password, role",
      });
    }

    if (!["examiner", "candidate"].includes(role)) {
      return res.status(400).json({ error: "Role must be examiner or candidate" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Check email not already taken
    const [existing] = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email));

    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const wallet = generateManagedWallet();

    const [user] = await db
      .insert(schema.users)
      .values({
        name,
        email,
        passwordHash,
        authProvider: "email",
        role,
        walletAddress: wallet.publicKey,
        walletType: "managed",
        encryptedPrivateKey: wallet.encryptedPrivateKey,
      })
      .returning();

    const sessionToken = await createSession(user.id);
    setSessionCookie(res, sessionToken);

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      walletType: user.walletType,
    });
  } catch (err) {
    console.error("Email signup error:", err);
    return res.status(500).json({ error: "Failed to create account" });
  }
});

// POST /auth/email/login

router.post("/email/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const sessionToken = await createSession(user.id);
    setSessionCookie(res, sessionToken);

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      walletType: user.walletType,
    });
  } catch (err) {
    console.error("Email login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

// POST /auth/wallet/login
// Verify Solana wallet signature → find or create user → set session

router.post("/wallet/login", async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature, message, role } = req.body;

    if (!walletAddress || !signature || !message) {
      return res
        .status(400)
        .json({ error: "Missing walletAddress, signature, or message" });
    }

    // Verify signature
    let pubKey: PublicKey;
    try {
      pubKey = new PublicKey(walletAddress);
    } catch {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Uint8Array.from(Buffer.from(signature, "base64"));
    const pubKeyBytes = pubKey.toBytes();

    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      pubKeyBytes
    );

    if (!isValid) {
      return res.status(401).json({ error: "Invalid wallet signature" });
    }

    // Find or create user
    let [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.walletAddress, walletAddress));

    if (!user) {
      const [newUser] = await db
        .insert(schema.users)
        .values({
          walletAddress,
          walletType: "external",
          authProvider: "wallet",
          role: role || "candidate",
        })
        .returning();
      user = newUser;
    }

    const sessionToken = await createSession(user.id);
    setSessionCookie(res, sessionToken);

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      walletType: user.walletType,
    });
  } catch (err) {
    console.error("Wallet login error:", err);
    return res.status(500).json({ error: "Wallet authentication failed" });
  }
});

// GET /auth/session - Validate current session

router.get("/session", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.[SESSION_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: "No session" });
    }

    const userId = await validateSession(token);
    if (!userId) {
      clearSessionCookie(res);
      return res.status(401).json({ error: "Session expired" });
    }

    const [user] = await db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
        walletAddress: schema.users.walletAddress,
        walletType: schema.users.walletType,
        authProvider: schema.users.authProvider,
        plan: schema.users.plan,
        planStatus: schema.users.planStatus,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userId));

    if (!user) {
      clearSessionCookie(res);
      return res.status(401).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("Session validation error:", err);
    return res.status(500).json({ error: "Session check failed" });
  }
});

// POST /auth/logout - Invalidate current session

router.post("/logout", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.[SESSION_COOKIE_NAME];
    if (token) {
      await deleteSession(token);
    }
    clearSessionCookie(res);
    return res.json({ success: true });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Logout failed" });
  }
});

export default router;
