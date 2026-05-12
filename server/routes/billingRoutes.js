// server/routes/billingRoutes.js
import express from "express"
import {
  handleWebhook,
  createCheckoutSession,
  getSubscriptionStatus
} from "../controllers/billingController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Webhook must use raw body — before express.json() parses it
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook)

router.post("/create-checkout-session", protect, createCheckoutSession)
router.get("/status", protect, getSubscriptionStatus)

export default router