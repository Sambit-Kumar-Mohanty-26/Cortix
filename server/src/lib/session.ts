import { db, schema } from "./db";
import { eq, lt } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const SESSION_COOKIE_NAME = "cortix_session";

/**
 * Create a new session for a user.
 * Returns the session token (uuid) to be set as a cookie.
 */
export async function createSession(userId: number): Promise<string> {
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(schema.sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  return sessionId;
}

/**
 * Validate a session token.
 * Returns the userId if valid, null if expired or not found.
 */
export async function validateSession(token: string): Promise<number | null> {
  if (!token) return null;

  const [session] = await db
    .select()
    .from(schema.sessions)
    .where(eq(schema.sessions.id, token));

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    // Clean up expired session
    await db.delete(schema.sessions).where(eq(schema.sessions.id, token));
    return null;
  }

  return session.userId;
}

/**
 * Delete a session (logout).
 */
export async function deleteSession(token: string): Promise<void> {
  await db.delete(schema.sessions).where(eq(schema.sessions.id, token));
}

/**
 * Clean up all expired sessions (can be called periodically).
 */
export async function purgeExpiredSessions(): Promise<void> {
  await db
    .delete(schema.sessions)
    .where(lt(schema.sessions.expiresAt, new Date()));
}
