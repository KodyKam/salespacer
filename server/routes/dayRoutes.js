// server/routes/dayRoutes.js
import express from "express"
import { endDay, startDay, updateSummary, endYesterday } from "../controllers/dayController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/end", protect, endDay)
router.post("/start", protect, startDay)
router.post("/end-yesterday", protect, endYesterday)
router.put("/summary", protect, updateSummary)

export default router