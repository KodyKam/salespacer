// server/routes/dayRoutes.js
import express from "express"
import { endDay, startDay } from "../controllers/dayController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/end", protect, endDay)
router.post("/start", protect, startDay)

export default router