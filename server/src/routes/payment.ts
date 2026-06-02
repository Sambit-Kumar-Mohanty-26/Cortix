import { Router, Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { db, schema } from "../lib/db";
import { eq } from "drizzle-orm";
import { validateSession, SESSION_COOKIE_NAME } from "../lib/session";

const router = Router();

// Razorpay instance
function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set");
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// Plan config
export const PLANS = {
  free: {
    id: "free",
    name: "Free Plan",
    price: 0,
    currency: "USD",
    features: [
      "Up to 5 active exams",
      "Up to 20 candidates per exam",
      "Basic proctoring",
      "Standard support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro Plan",
    price: 49,
    priceInPaise: 4900 * 95, // $49 * 95 INR/USD (approx), in paise
    currency: "INR",
    features: [
      "Unlimited active exams",
      "Unlimited candidates",
      "Advanced AI proctoring",
      "NFT certificate minting",
      "Priority support",
      "Analytics dashboard",
    ],
  },
};

// Auth middleware
async function requireAuth(
  req: Request,
  res: Response,
  next: () => void
): Promise<Response | void> {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const userId = await validateSession(token);
  if (!userId) {
    return res.status(401).json({ error: "Session expired" });
  }

  (req as Request & { userId: number }).userId = userId;
  return next();
}

// GET /payment/plans - Return available plans

router.get("/plans", (_req: Request, res: Response) => {
  return res.json(PLANS);
});

// POST /payment/create-order - Create a Razorpay order for Pro plan

router.post(
  "/create-order",
  (req, res, next) => requireAuth(req, res, next),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as Request & { userId: number }).userId;

      // Verify user is an examiner
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, userId));

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.role !== "examiner") {
        return res.status(403).json({ error: "Only examiners can subscribe to a plan" });
      }
      if (user.plan === "pro" && user.planStatus === "active") {
        return res.status(400).json({ error: "Already on Pro plan" });
      }

      const razorpay = getRazorpay();
      const plan = PLANS.pro;

      const order = await razorpay.orders.create({
        amount: plan.priceInPaise,
        currency: plan.currency,
        receipt: `cortix_pro_${userId}_${Date.now()}`,
        notes: {
          userId: String(userId),
          plan: "pro",
          userEmail: user.email || "",
        },
      });

      // Store the order ID on the user row
      await db
        .update(schema.users)
        .set({
          razorpayOrderId: order.id,
          planStatus: "pending_payment",
        })
        .where(eq(schema.users.id, userId));

      return res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (err) {
      console.error("Create order error:", err);
      return res.status(500).json({ error: "Failed to create payment order" });
    }
  }
);

// POST /payment/verify - Verify payment signature & activate Pro plan

router.post(
  "/verify",
  (req, res, next) => requireAuth(req, res, next),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as Request & { userId: number }).userId;
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({
          error: "Missing razorpayOrderId, razorpayPaymentId, or razorpaySignature",
        });
      }

      // Verify HMAC signature
      const keySecret = process.env.RAZORPAY_KEY_SECRET!;
      const body = `${razorpayOrderId}|${razorpayPaymentId}`;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ error: "Payment verification failed: invalid signature" });
      }

      // Activate Pro plan
      const [updatedUser] = await db
        .update(schema.users)
        .set({
          plan: "pro",
          planStatus: "active",
          razorpayOrderId,
          razorpayPaymentId,
        })
        .where(eq(schema.users.id, userId))
        .returning({
          id: schema.users.id,
          plan: schema.users.plan,
          planStatus: schema.users.planStatus,
        });

      return res.json({
        success: true,
        plan: updatedUser.plan,
        planStatus: updatedUser.planStatus,
        message: "Pro plan activated successfully!",
      });
    } catch (err) {
      console.error("Payment verify error:", err);
      return res.status(500).json({ error: "Payment verification failed" });
    }
  }
);

// POST /payment/select-free - Explicitly choose free plan

router.post(
  "/select-free",
  (req, res, next) => requireAuth(req, res, next),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as Request & { userId: number }).userId;

      await db
        .update(schema.users)
        .set({ plan: "free", planStatus: "active" })
        .where(eq(schema.users.id, userId));

      return res.json({ success: true, plan: "free" });
    } catch (err) {
      console.error("Select free plan error:", err);
      return res.status(500).json({ error: "Failed to select free plan" });
    }
  }
);

export default router;
