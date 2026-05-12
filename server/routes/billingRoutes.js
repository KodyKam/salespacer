// server/routes/billingRoutes.js
import express from "express"
import {
  handleWebhook,
  createCheckoutSession,
  getSubscriptionStatus
} from "../controllers/billingController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/create-checkout-session", protect, createCheckoutSession)
router.get("/status", protect, getSubscriptionStatus)

export default router